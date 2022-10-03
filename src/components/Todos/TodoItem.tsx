import classNames from 'classnames';
import { Dispatch, SetStateAction } from 'react';
import { deleteTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setError: Dispatch<SetStateAction<boolean>>;
  setErrorMessage: Dispatch<SetStateAction<string>>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todos,
  setTodos,
  setError,
  setErrorMessage,
}) => {
  const handleDelete = () => {
    deleteTodo(todo.id)
      .then(() => {
        setTodos(todos.filter(tod => tod.id !== todo.id));
      })
      .catch(() => {
        setError(true);
        setErrorMessage('Unable to delete a todo');
      });
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={handleDelete}
      >
        ×
      </button>

      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
