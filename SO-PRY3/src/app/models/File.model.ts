export interface File_{
    name : string
    ext : string
    date_created : string
    date_modified : string
    size : number
    content : string
}

export interface createFile_{
    username: string
    name: string
    ext: string
    date_created: string | null
    date_modified: string | null
    content: string
    target_dir: string
    size : string
}


export interface modifyFile_{
    username: string
    name: string
    ext: string
    date_created: string | null
    date_modified: string | null
    content: string
    target_dir: string
    size : string
    old_name: string
}
