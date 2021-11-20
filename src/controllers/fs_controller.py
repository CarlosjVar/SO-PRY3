import os
DRIVE_LOCAL_ROUTE = "../Drive"


def create_drive(username, name):
    result = [None, []]
    try:
        drive_route = f"{DRIVE_LOCAL_ROUTE}/{username}_{name}"
        os.mkdir(drive_route)
        result[0] = [drive_route, name]
        return result
    except FileExistsError:
        result[1].append("Ya existe un velvetorio con este nombre")
        return result


def create_dir(name, target_dir):
    result = [None, []]
    try:
        drive_route = f"{target_dir}/{name}"
        os.mkdir(drive_route)
        result[0] = [drive_route, name]
        return result
    except FileExistsError:
        result[1].append("Ya existe un velvetorio con este nombre")
        return result
