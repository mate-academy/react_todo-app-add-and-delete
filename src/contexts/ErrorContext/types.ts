export type TodoError =
  | ''
  | 'Unable to load todos'
  | 'Title should not be empty'
  | 'Unable to add a todo'
  | 'Unable to update a todo'
  | 'Unable to delete a todo';

export type ErrorContextValue = {
  error: { message: TodoError };
  setError: React.Dispatch<React.SetStateAction<{ message: TodoError }>>;
};
