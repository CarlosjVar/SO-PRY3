class Directory:
    def __init__(self, virtual_route, physical_route, directories, files, size) -> None:
        self.virtual_route = virtual_route
        self.physical_route = physical_route
        self.directories = directories
        self.files = files
        self.size = size
