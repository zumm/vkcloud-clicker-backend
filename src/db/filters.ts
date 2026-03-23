import { type Column, eq, type GetColumnData, isNull } from 'drizzle-orm'

export const isNotDistinctFrom = <TColumn extends Column>(
  column: TColumn,
  value: GetColumnData<TColumn, 'query'>,
) => {
  return value === null ? isNull(column) : eq(column, value)
}
