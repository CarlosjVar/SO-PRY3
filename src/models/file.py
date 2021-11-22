class File:
    def __init__(self, name, ext, date_created, date_modified, size, content) -> None:
        self.name = name
        self.ext = ext
        self.date_created = date_created
        self.date_modified = date_modified
        self.size = size
        self.content = content
        pass
