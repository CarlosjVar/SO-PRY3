from os import path
import xml.etree.ElementTree as ET
from models.user import User
from controllers.fs_controller import DRIVE_LOCAL_ROUTE, create_drive, create_dir
XML_PATH = './data/userInfo.xml'


def write_dir(username, type, target_dir, attrib):
    print("Entró")
    tree = ET.parse(XML_PATH)
    root = tree.getroot()
    users = root.find("usuarios")
    selected_user = None
    for usuario in users.findall("usuario"):
        if (usuario.get("username") == username):
            selected_user = usuario
    if selected_user is None:
        # Return error
        pass
    dirs = selected_user.findall("dir")
    search_dir([], dirs[0], attrib, type)
    tree.write(XML_PATH)
    return


def search_dir(path_array, element, args: dict, type):

    if(len(path_array) == 0):
        local_dir = element.get("local")
        if type == "dir":
            dir_result = create_dir(args["name"], local_dir)
            attrib = {"local": dir_result[0][0], "virtual": args["name"]}
            child_dir = element.makeelement("dir", attrib)
            element.append(child_dir)
        else:
            # TODO create file
            pass
        element.makeelement(type, args)
    else:
        pass


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
