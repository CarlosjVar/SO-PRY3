import { File_ } from "./File.model"

export interface Directory{
    virtual_route : string
    directories? : Directory[]
    files? : File_[]
    size : number
    parent: string;
}

export interface createDirectory{
    username : string
    name : string
    target_dir : string
}
