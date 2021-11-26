export interface toDelete {
  from_directory: string | null;
  target_element: string;
  username: string;
  type: string;
}

export interface itemsToDelete {
  items: toDelete[];
}

export interface toMove {
  from_directory: string;
  target_element: string;
  to_directory: string;
  username: string;
  type: string;
}

export interface toShare {
  from_directory: string;
  target_element: string;
  username: string;
  target_username: string;
  type: string;
}

export interface user{
  username: string;
}