
import xml.etree.ElementTree as ET

from models.user import User
from models.directory import Directory
from models.file import File

XML_PATH = "./data/userInfo.xml"


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

    if target_dir_element_result == None:
        result[1].append(
            "Nuestros Velvuscadores no pudieron encontrar este directorio")
        return result
    target_dir_element = target_dir_element_result[0]

    if(type == "file"):

        if(not validateName(target_dir_element, args["name"], "file")):
            result[1].append(
                "A nuestro Velvet buscador le parece que ya existe un velvet archivo con ese nombre")
            return result

        attrib = {"name": args["name"], "ext": args["ext"], "date_created": args["date_created"],
                  "date_modified": args["date_modified"], "size": args["size"], "content": args["content"]}
        child_dir = target_dir_element.makeelement(type, attrib)
        target_dir_element.append(child_dir)
        result[0] = File(args["name"], args["ext"], args["date_created"],
                         args["date_modified"], args["size"], args["content"], target_dir_element_result[1])
    elif(type == "dir"):
        if(not validateName(target_dir_element, args["name"], "dir")):
            result[1].append(
                "A nuestro Velvet buscador le parece que ya existe un velvet directorio con ese nombre")
            return result
        attrib = {"virtual": args["name"]}
        child_dir = target_dir_element.makeelement(type, attrib)
        target_dir_element.append(child_dir)
        result[0] = Directory(
            args["name"], 0, parent=target_dir_element_result[1])
    tree.write(XML_PATH)
    return result


def meassureSize(element):
    finalSize = 0
    for file in element.findall("file"):
        finalSize = finalSize + int(file.get("size"))
    return finalSize


def modifyFile(element, attributes, name):
    for file in element.findall("file"):
        if file.get("name") == name:
            for key, value in attributes.items():
                file.set(key, value)
            return File(file.get("name"), file.get("ext"), file.get("date_created"), file.get("date_modified"), file.get("size"), file.get("content"))


def modifyFileHelper(target_dir, attributes, name, username):
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
    if target_dir_element_result == None:
        result[1].append(
            "Nuestros Velvuscadores no pudieron encontrar este directorio")
        return result
    modified_file = modifyFile(target_dir_element_result[0], attributes, name)

    if(modified_file == None):
        result[1].append(
            "Velvet tuvo problemas editando su gato archivo, por favor quítese esas lagañas y revise que hizo mal")
        return result
    tree.write(XML_PATH)
    modified_file.parent = target_dir_element_result[1]
    result[0] = modified_file
    return result


def validateName(element, name, type):
    finalSize = 0
    available = True
    if type == "dir":
        for directory in element.findall("dir"):
            if(directory.get("virtual") == name):
                available = False
    elif type == "file":
        for file in element.findall("file"):
            if(file.get("name") == name):
                available = False
    return available


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
              "password": password, "size": str(size)}
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
    result[0] = User(username, password, drive_name, int(size))
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
    dir_result = (search_dir(target_dir, selected_user, ""))
    if dir_result is None:
        result[1].append(
            "Nuestros Velvuscadores no pudieron encontrar ningún directorio relacionado con este usuario.")
        return result
    element, name = dir_result
    for file_elem in element.findall("file"):
        newFile = File(file_elem.get("name"), file_elem.get(

            ("ext")), file_elem.get(("date_created")), file_elem.get(("date_modified")), file_elem.get(("size")), file_elem.get(("content")), name)
        files.append(newFile)

    for directory in element.findall("dir"):
        print(f"El espacio de este directorio es {meassureSize(directory)}")
        newDir = Directory(directory.get("virtual"), 0, [], [], parent=name)
        directories.append(newDir)

    print(validateName(element, "pepito2", "dir"))
    size = calc_subfolders(element)
    print(f"El espacio de este directorio es {size}")
    directory = Directory(element.get("virtual"),
                          size, directories, files, name)
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
    result[0] = User(username, password, "", int(selected_user.get("size")))
    return result


def copy_dir(source_dir, target_dir, object, username, type):

    result = [None, []]
    tree = ET.parse(XML_PATH)
    root = tree.getroot()
    users = root.find("usuarios")
    for usuario in users.findall("usuario"):
        if (usuario.get("username") == username):
            selected_user = usuario

    if selected_user is None:
        result[1].append(
            "Nuestros Velvebuscadores no puedieron encontrar ningún directorio relacionado con este usuario.")
        return result
    source_dir_element_result = search_dir(source_dir, selected_user, "")
    target_dir_element_result = search_dir(target_dir, selected_user, "")

    if(source_dir_element_result == None or target_dir_element_result == None):
        result[1].append(
            "Nuestros Velvebuscadores no puedieron encontrar ningún directorio relacionado con este usuario.")
        return result
    source_dir_element = source_dir_element_result[0]
    target_dir_element = target_dir_element_result[0]
    if(type == "dir"):
        selected_dir = None
        for directory in source_dir_element.findall("dir"):
            if(directory.get("virtual") == object):
                selected_dir = directory
            pass
        if selected_dir == None:
            result[1].append(
                "Nuestros Velvebuscadores no puedieron encontrar ningún directorio relacionado con este usuario.")
            return result
        if(not validateName(target_dir_element, object, "dir")):
            delete_item(target_dir_element, object, "dir")
        target_dir_element.append(selected_dir)
    elif(type == "file"):
        selected_file = None
        for file in source_dir_element.findall("file"):
            if(file.get("name") == object):
                selected_file = file
        if selected_file == None:
            result[1].append(
                "Nuestros Velvebuscadores no puedieron encontrar ningún archivo relacionado con este usuario.")
            return result
        if(not validateName(target_dir_element, object, "file")):
            delete_item(target_dir_element, object, "file")
        target_dir_element.append(selected_file)
    tree.write(XML_PATH)
    result[0] = "El omnipotente Velvet rompió las leyes de la metafísica y clonó su item"
    return result


def share_item(source_dir, object, username, username_target, type):
    result = [None, []]
    tree = ET.parse(XML_PATH)
    root = tree.getroot()
    users = root.find("usuarios")
    for usuario in users.findall("usuario"):
        if (usuario.get("username") == username):
            selected_user = usuario
        if (usuario.get("username") == username_target):
            selected_user_target = usuario
    if selected_user is None:
        result[1].append(
            "Nuestros Velvebuscadores no puedieron encontrar ningún directorio relacionado con este usuario.")
        return result
    if selected_user_target is None:
        result[1].append(
            "Nuestros Velvebuscadores no puedieron encontrar ningún directorio relacionado con este usuario.")
        return result
    source_dir_element_result = search_dir(source_dir, selected_user, "")
    if source_dir_element_result is None:
        result[1].append(
            "Nuestros Velvebuscadores no puedieron encontrar ningún directorio relacionado con este usuario.")
        return result

    source_dir_element = source_dir_element_result[0]

    target_dir_element_result = search_dir(
        ["My shared files"], selected_user_target, "")
    target_dir_element = target_dir_element_result[0]

    if(type == "dir"):
        selected_dir = None
        for directory in source_dir_element.findall("dir"):
            if(directory.get("virtual") == object):
                selected_dir = directory
        if selected_dir == None:
            result[1].append(
                "Nuestros Velvebuscadores no puedieron encontrar ningún directorio relacionado con este usuario.")
            return result
        if(not validateName(target_dir_element, object, "dir")):
            delete_item(target_dir_element, object, "dir")
        target_dir_element.append(selected_dir)
    elif(type == "file"):
        selected_file = None
        for file in source_dir_element.findall("file"):
            if(file.get("name") == object):
                selected_file = file
        if selected_file == None:
            result[1].append(
                "Nuestros Velvebuscadores no puedieron encontrar ningún archivo relacionado con este usuario.")
            return result
        if(not validateName(target_dir_element, object, "file")):
            delete_item(target_dir_element, object, "file")
        target_dir_element.append(selected_file)
    tree.write(XML_PATH)
    result[0] = "El omnipotente Velvet rompió las leyes de la metafísica y compartió su item"
    return result


def move_item(source_dir, target_dir, object, username, type):
    result = [None, []]
    source_dir_copy = [element for element in source_dir]

    copy_result = copy_dir(source_dir, target_dir, object, username, type)
    if(len(copy_result[1]) > 0):
        result[1] += copy_result[1]
        return result

    tree = ET.parse(XML_PATH)
    root = tree.getroot()
    users = root.find("usuarios")
    for usuario in users.findall("usuario"):
        if (usuario.get("username") == username):
            selected_user = usuario
    if selected_user is None:
        result[1].append(
            "Nuestros Velvebuscadores no puedieron encontrar ningún directorio relacionado con este usuario.")
        return result
    source_dir_element_result = search_dir(source_dir_copy, selected_user, "")

    source_dir_element = source_dir_element_result[0]

    print(source_dir)
    delete_result = delete_item(source_dir_element, object, type)
    if(not delete_result):
        result[1] += ["velvet perdio interes en borrar el archivo"]
        return result
    tree.write(XML_PATH)
    result[0] = "Gatoexito"
    return result


def delete_dir(source_dir, name, type, username):
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
    source_dir_element_result = search_dir(source_dir, selected_user, "")

    source_dir_element = source_dir_element_result[0]
    result[0] = delete_item(source_dir_element, name, type)
    # Searches for target dir
    tree.write(XML_PATH)
    return result


def delete_item(element, name, type):
    if(type == "dir"):
        for directory in element.findall("dir"):
            if directory.get("virtual") == name:
                element.remove(directory)
                return True
    else:
        for file in element.findall("file"):
            if file.get("name") == name:
                element.remove(file)
                return True
    return False


def calc_subfolders(element):
    size = 0
    name = element.get("virtual")

    for directory in element.findall("dir"):
        if(directory.get("virtual") == 'My shared files'):
            continue
        size += calc_subfolders(directory)
        print(f"El folder {element.get('virtual')} pesa {size}")
    size += meassureSize(element)

    return size
