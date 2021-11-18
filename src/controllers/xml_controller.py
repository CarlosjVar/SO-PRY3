import xml.etree.ElementTree as ET
from models.user import User
from controllers.fs_controller import create_drive


def register_user(signup_info):
    result = [None, []]
    username = signup_info["username"]
    password = signup_info["password"]
    drive_name = signup_info["drive_name"]
    size = signup_info["size"]
    tree = ET.parse('./data/userInfo.xml')
    root = tree.getroot()
    users = root.find("usuarios")
    for usuario in users.findall("usuario"):
        if (usuario.get("username") == username):
            result[1].append(
                "Velvet está en peligro, ya existe un velvet usuario con ese velvet nombre de usuario")
            return result

    attrib = {"username": username,
              "password": password}
    user = users.makeelement("usuario", attrib)
    users.append(user)
    # Drive creation
    drive_info = create_drive(username, drive_name)
    if len(drive_info[1]) > 0:
        result[1] += drive_info[1]
        return result
    tree.write('./data/userInfo.xml')
    result[0] = User(username, password, drive_info[0][0])
    return result
