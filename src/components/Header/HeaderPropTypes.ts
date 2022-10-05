export type Props = {
  newTodoField: React.RefObject<HTMLInputElement>
  addTodo: (title: string) => void;
  isAdding: boolean;
  setErrorMessage: (message: string) => void;
};
