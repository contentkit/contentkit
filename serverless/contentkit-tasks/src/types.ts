export type HasuraTable = {
  schema: string,
  name: string
}

export type HasuraTrigger = {
  name: string
}

export type HasuraEvent<T> = {
  session_variables: any,
  op: string,
  data: {
    old: any,
    new: T
  }
}

export type Task = {
  status: string,
  updated_at: string,
  created_at: string,
  project_id: string,
  metadata: any,
  id: string,
  user_id: string,
  storage_key: string
}

export type HasuraTriggerEvent<T> = {
  id: string,
  table: HasuraTable,
  trigger: HasuraTrigger,
  event: HasuraEvent<T>,
  delivery_info: any,
  created_at: string
}

export type HasuraTask = HasuraTriggerEvent<Task>