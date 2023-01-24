import { Todo } from './ITodo';

export enum Error {
  None,
  Add,
  Delete,
  Update,
  Title,
}

export type ContextProps = {
  userId: number
  todos: Todo[]
  error: Error
  tempTodo: Todo | null
  isLoadingMany: boolean
  isDeleting: boolean
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  setError: React.Dispatch<React.SetStateAction<Error>>
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>
  setIsLoadingMany: React.Dispatch<React.SetStateAction<boolean>>
  setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>
};
