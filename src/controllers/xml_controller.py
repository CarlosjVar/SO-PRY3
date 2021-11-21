from os import path
from typing import cast
import xml.etree.ElementTree as ET
from models.user import User
from models.directory import Directory
from models.file import File
from controllers.fs_controller import DRIVE_LOCAL_ROUTE, create_drive, create_dir
XML_PATH = './data/userInfo.xml'


def write_dir(username, type, target_dir, args):
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
    dirs = selected_user.findall("dir")
    target_dir_element = search_dir(target_dir,
                                    dirs[0])

    if(type == "dir"):
        local_dir = target_dir_element.get("local")
        dir_result = create_dir(args["name"], local_dir)
        if len(dir_result[1]) > 0:
            result[1] += dir_result[1]
            return result
        attrib = {"local": dir_result[0][0], "virtual": args["name"]}
        child_dir = target_dir_element.makeelement("dir", attrib)
        target_dir_element.append(child_dir)
    tree.write(XML_PATH)
    result[0] = {"msg": "Velvet logró crear su directorio"}
    return result


def search_dir(path_array: list, element):
    # Stop condition, already in requested dir
    if(len(path_array) == 0):
        print("Encontré")
        return element
    # Keep going inside dirs until path list is empty
    else:
        dirs = element.findall("dir")
        dir_search = path_array.pop()
        for directory in dirs:
            if directory.get("virtual") == dir_search:
                return search_dir(path_array, directory)


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
    # Drive creation
    drive_info = create_drive(username, drive_name)
    if len(drive_info[1]) > 0:
        result[1] += drive_info[1]
        return result
    # Create dir on xml
    attrib = {"local": drive_info[0][0], "virtual": drive_info[0][1]}
    directory = user.makeelement("dir", attrib)
    user.append(directory)
    users.append(user)
    # Write xml
    tree.write(XML_PATH)
    result[0] = User(username, password, drive_info[0][0], drive_info[0][1])
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
    dirs = selected_user.findall("dir")[0]
    element = search_dir(target_dir, dirs)

    for file_elem in element.findall("file"):
        newFile = File(file_elem.get("name"), file_elem.get(
            ("ext")), file_elem.get(("date_created")), file_elem.get(("date_modified")), file_elem.get(("size")))
        files.append(newFile)

    for directory in element.findall("dir"):
        print(directory.get("virtual"))
        newDir = Directory(directory.get("virtual"),
                           directory.get("local"),
                           0)
        directories.append(newDir)
    directory = Directory(element.get("virtual"),
                          element.get("local"), 0, directories)
    result[0] = directory
    return result
