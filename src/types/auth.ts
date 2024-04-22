import { UserApiProps } from '@/types/models/user'

export interface AuthStoreProps {
  profile?: UserApiProps
  setProfile: (profile: UserApiProps) => void
  signed?: boolean
  setSigned: (signed: boolean) => void
  logout: () => void
}
