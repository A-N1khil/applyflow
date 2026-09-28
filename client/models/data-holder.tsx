export interface DataHolder<T> {
  data: T | null
  status_code: number
  message: string | null
}
