import json


class User:
    def __init__(self, username, password, root_directory, virtual_dir) -> None:
        self.username = username
        self.password = password
        self.root_directory = root_directory
        self.virtual_root_direcotry = virtual_dir

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__,
                          sort_keys=True, indent=4)
