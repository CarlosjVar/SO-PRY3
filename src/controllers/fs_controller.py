import os
DRIVE_LOCAL_ROUTE = "../Drive"


def create_drive(username, name):
    result = [None, []]
    try:
        drive_route = f"{DRIVE_LOCAL_ROUTE}/{username}_{name}"
        os.mkdir(drive_route)
        for dir in os.listdir(DRIVE_LOCAL_ROUTE):
            print(dir)
        result[0] = [drive_route, name]
        return result
    except FileExistsError:
        result[1].append("Ya existe un directorio con este nombre")
        return result
