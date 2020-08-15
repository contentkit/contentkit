import { ModalType } from '../../fixtures'

export type ModalItem = {
  name: ModalType,
  Component: any,
  getComponentProps: (props: any) => any
}

export type DashboardSettings = {
  selected_project_id: string | null
}
