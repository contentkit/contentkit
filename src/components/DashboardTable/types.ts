export enum ColumnPropertyName {
  TITLE = 'title',
  STATUS = 'status',
  PROJECT = 'project',
  CREATED_AT = 'created_at',
  POSTS_TAGS = 'posts_tags'
}

export enum PaginationDirection {
  FORWARD = 'forward',
  BACKWARD = 'backward'
}

export type ColumnOption = {
  key: string,
  label: string
}

export type Column = {
  title: string,
  key: string,
  dataIndex: string,
  editable: boolean,
  render: (x: any) => any,

  Component?: any,
  getOptions?: () => ColumnOption[]
}
