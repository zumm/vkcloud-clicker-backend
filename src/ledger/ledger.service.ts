import assert from 'node:assert/strict'
import { Injectable } from '@nestjs/common'
import { TransactionHost } from '@nestjs-cls/transactional'
import { type DbTransactionalAdapter } from 'src/db/db.provider'
import { ledger } from 'src/db/schema'
import { CreateRecordInput } from './interfaces'

@Injectable()
export class LedgerService {
  constructor(
    private readonly txHost: TransactionHost<DbTransactionalAdapter>,
  ) {}

  async createRecord(input: CreateRecordInput) {
    const [record] = await this.txHost.tx
      .insert(ledger)
      .values(input)
      .returning({ id: ledger.id })

    assert(record)

    return record.id
  }
}
