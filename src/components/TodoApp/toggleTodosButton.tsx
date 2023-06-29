import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { updateTodoCheck } from '../../api/todos';
import { ErrorType } from '../../types/Error';

type Props = {
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  onError: (error: ErrorType) => void,
};

export const ToggleTodosButton: React.FC<Props> = ({
  todos,
  setTodos,
  onError: setErrorType,
}) => {
  const toggleAll = () => {
    if (todos.some((item) => !item.completed)) {
      Promise.all(
        todos.map((item) => updateTodoCheck(item.id, true)),
      )
        .then(() => {
          const updatedTodos = todos.map((todo) => ({
            ...todo,
            completed: true,
          }));

          setTodos(updatedTodos);
        })
        .catch(() => {
          setErrorType(ErrorType.UPDATE);
        });
    } else {
      Promise.all(
        todos.map((item) => updateTodoCheck(item.id, false)),
      )
        .then(() => {
          const updatedTodos = todos.map((todo) => ({
            ...todo,
            completed: false,
          }));

          setTodos(updatedTodos);
        })
        .catch(() => {
          setErrorType(ErrorType.UPDATE);
        });
    }
  };

  return (
    <>
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every((todo) => todo.completed),
          })}
          onClick={() => toggleAll()}
          aria-label="Toggle all todos"
        />
      )}
    </>
  );
};
