import type { User } from 'src/users/interfaces'

export interface RaffleOutput {
  promocodesLeft: number
  result: Array<{
    user: User
    code: string
  }>
}
