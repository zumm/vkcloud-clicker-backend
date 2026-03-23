import type { Job, Queue } from 'bullmq'

export interface MessageJobData {
  chatId: number | string
  message: string
}

export type MessageJob = Job<MessageJobData, void, 'message'>

export type TgPushQueue = Queue<MessageJob>
