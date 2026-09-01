export interface DataHolder<T> {
  data: T | null
  status: number
  messages: string | null
}
