import json


class User:
    def __init__(self, username, password, virtual_dir, size=0) -> None:
        self.username = username
        self.password = password
        self.virtual_root_directory = virtual_dir
        self.max_drive_size = size

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)

    def __str__(self):
        return f"Username {self.username} password {self.password} dir {self.virtual_root_directory}"
