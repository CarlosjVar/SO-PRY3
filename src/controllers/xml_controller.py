from logging import log
from os import path
import xml.etree.ElementTree as ET
from models.user import User
from models.directory import Directory
from models.file import File
from controllers.fs_controller import DRIVE_LOCAL_ROUTE, create_drive, create_dir
XML_PATH = './data/userInfo.xml'


def xml_write(username, type, target_dir, args):
    result = [None, []]

    tree = ET.parse(XML_PATH)
    root = tree.getroot()
    users = root.find("usuarios")
    selected_user = None
    # Searches for selected user
    for usuario in users.findall("usuario"):
        if (usuario.get("username") == username):
            selected_user = usuario
    if selected_user is None:
        result[1].append(
            "Nuestros Velvuscadores no pudieron encontrar ningún directorio relacionado con este usuario.")
        return result
    # Searches for target dir
    target_dir_element_result = (search_dir(target_dir,
                                            selected_user, ""))
    target_dir_element = target_dir_element_result[0]

    print(target_dir_element_result[1])
    if(type == "file"):
        attrib = {"name": args["name"], "ext": args["ext"], "date_created": args["date_created"],
                  "date_modified": args["date_modified"], "size": args["size"], "content": args["content"]}
        child_dir = target_dir_element.makeelement(type, attrib)
        target_dir_element.append(child_dir)
        result[0] = File(args["name"], args["ext"], args["date_created"],
                         args["date_modified"], args["size"], args["content"], target_dir_element_result[1])
    elif(type == "dir"):
        attrib = {"virtual": args["name"]}
        child_dir = target_dir_element.makeelement(type, attrib)
        target_dir_element.append(child_dir)
        result[0] = Directory(
            args["name"], 0, parent=target_dir_element_result[1])
    tree.write(XML_PATH)
    return result


def messureSize(element):
    finalSize = 0
    for directory in element.findall("dir"):
        for file in directory.findall("file"):
            finalSize = finalSize + int(file.get("size"))
    for file in element.findall("file"):
        finalSize = finalSize + int(file.get("size"))
    return finalSize


def search_dir(path_array: list, element, name):
    # Stop condition, already in requested dir
    if(len(path_array) == 0):
        return [element, name[:-1]]
    # Keep going inside dirs until path list is empty
    else:
        dirs = element.findall("dir")
        dir_search = path_array.pop()
        for directory in dirs:
            if directory.get("virtual") == dir_search:
                name = name + directory.get("virtual") + "/"
                return search_dir(path_array, directory, name)


def register_user(signup_info):
    result = [None, []]
    username = signup_info["username"]
    password = signup_info["password"]
    drive_name = signup_info["drive_name"]
    size = signup_info["size"]
    tree = ET.parse(XML_PATH)
    root = tree.getroot()
    users = root.find("usuarios")
    for usuario in users.findall("usuario"):
        if (usuario.get("username") == username):
            result[1].append(
                "Velvet está en grave peligro, ya existe un velvet usuario con ese velvet nombre de usuario")
            return result

    attrib = {"username": username,
              "password": password}
    user = users.makeelement("usuario", attrib)
    # Create dir on xml
    attrib = {"virtual": drive_name}
    directory = user.makeelement("dir", attrib)
    user.append(directory)
    shared = user.makeelement("dir", {"virtual": "My shared files"})
    user.append(shared)
    users.append(user)
    # Write xml
    tree.write(XML_PATH)
    result[0] = User(username, password, drive_name)
    return result


def listContent(target_dir, username):
    directories = []
    files = []
    result = [None, []]
    tree = ET.parse(XML_PATH)
    root = tree.getroot()
    users = root.find("usuarios")
    selected_user = None
    # Searches for selected user
    for usuario in users.findall("usuario"):
        if (usuario.get("username") == username):
            selected_user = usuario
    if selected_user is None:
        result[1].append(
            "Nuestros Velvebuscadores no puedieron encontrar ningún directorio relacionado con este usuario.")
        return result
    # Searches for target dir
    # dirs = selected_user.findall("dir")[0]
    # element = search_dir(target_dir, dirs)
    element, name = (search_dir(target_dir, selected_user, ""))

    for file_elem in element.findall("file"):
        newFile = File(file_elem.get("name"), file_elem.get(
            ("ext")), file_elem.get(("date_created")), file_elem.get(("date_modified")), file_elem.get(("size")), file_elem.get(("content")),)
        files.append(newFile)

    for directory in element.findall("dir"):
        print(f"El espacio de este directorio es {messureSize(directory)}")
        newDir = Directory(directory.get("virtual"),
                           directory.get("local"),
                           0)
        directories.append(newDir)
    print(f"El espacio de este directorio es {messureSize(element)}")
    directory = Directory(element.get("virtual"),
                          0, directories, files, name)
    result[0] = directory
    return result


def login_user(username, password):

    result = [None, []]
    tree = ET.parse(XML_PATH)
    root = tree.getroot()
    users = root.find("usuarios")
    selected_user = None
    # Searches for selected user
    for usuario in users.findall("usuario"):
        if (usuario.get("username") == username):
            selected_user = usuario
    if selected_user is None:
        result[1].append(
            "No se velvet encontró ningún velvet usuario, que velvet lástima")
        return result
    print(
        f"Del user {selected_user.get('password')} del login info {password}")
    if (selected_user.get("password") != password):
        result[1].append(
            "No sea velvet pendejo, ponga su velvet contraseña bien")
        return result
    result[0] = User(username, password, "")
    return result
