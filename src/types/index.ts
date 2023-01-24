import { ITodo } from './ITodo';

export enum Error {
  None,
  Add,
  Delete,
  Update,
  Title,
}

export type ContextProps = {
  userId: number
  todos: ITodo[]
  error: Error
  tempTodo: ITodo | null
  isLoadingMany: boolean
  isDeleting: boolean
  setTodos: React.Dispatch<React.SetStateAction<ITodo[]>>
  setError: React.Dispatch<React.SetStateAction<Error>>
  setTempTodo: React.Dispatch<React.SetStateAction<ITodo | null>>
  setIsLoadingMany: React.Dispatch<React.SetStateAction<boolean>>
  setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>
};
