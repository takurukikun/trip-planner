import { UserApiProps } from './user'
import { DefaultApiProps } from '@/types'

export interface VacationApiProps extends DefaultApiProps {
  title: string
  description: string
  dates: string[]
  location: string
  photo: string
  users: UserApiProps[]
}
