export interface ErrorContextType {
  isError: boolean
  setIsError: (value: boolean) => void
  errorText: string
  setErrorText: (value: string) => void
}
