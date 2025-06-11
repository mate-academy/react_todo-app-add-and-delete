import { deleteTodo } from '../api/todos';
import { ErrorMessage } from '../types/ErrorMessage';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (e: ErrorMessage) => void;
  setLoadingIds: (ids: number[]) => void;
  focusInput: () => void;
};
export const ClearCompletedButton = ({
  todos,
  setTodos,
  setErrorMessage,
  setLoadingIds,
  focusInput,
}: Props) => {
  const clearHandler = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setLoadingIds(completedTodos.map(todo => todo.id));
    Promise.allSettled(completedTodos.map(todo => deleteTodo(todo.id)))
      .then(results => {
        const deletedTodos = completedTodos.filter(
          (_, i) => results[i].status === 'fulfilled',
        );

        setTodos(
          todos.filter(todo =>
            deletedTodos.every(delTodo => delTodo.id !== todo.id),
          ),
        );

        if (deletedTodos.length !== completedTodos.length) {
          setErrorMessage('Unable to delete a todo');
        }
      })
      .finally(() => {
        setLoadingIds([]);
        focusInput();
      });
  };

  return (
    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={todos.every(todo => !todo.completed) ? true : false}
      onClick={clearHandler}
    >
      Clear completed
    </button>
  );
};
