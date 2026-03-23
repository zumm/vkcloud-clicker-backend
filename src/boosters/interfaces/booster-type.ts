import type { boosterType } from 'src/db/schema'

export type BoosterType = (typeof boosterType.enumValues)[number]
