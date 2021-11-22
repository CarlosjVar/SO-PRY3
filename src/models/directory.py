import json


class Directory:
    def __init__(self, virtual_route, size, directories=None, files=None) -> None:
        self.virtual_route = virtual_route
        self.directories = directories
        self.files = files
        self.size = size

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)
