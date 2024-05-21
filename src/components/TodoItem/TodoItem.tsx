/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Error } from '../../types/Error';
import { deleteTodo } from '../../api/todos';

interface Props {
  todo: Todo;
  isTemp: boolean;
  deleteIds: number[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
  setDeleteIds: React.Dispatch<React.SetStateAction<number[]>>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isTemp,
  deleteIds,
  setTodos,
  setError,
  setDeleteIds,
}) => {
  const handleDeleteTodo = (todoId: number) => {
    setDeleteIds(prevIds => [...prevIds, todoId]);

    deleteTodo(todoId)
      .then(() => setTodos((prevTodos: Todo[]) => prevTodos.filter(todoItem => todoItem.id !== todoId)))
      .catch(() => {
        setError(Error.UnableDelete);
      })
      .finally(() => {
        setDeleteIds(prevIds => prevIds.filter(id => id !== todoId));
      });
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          data-cy="TodoStatus"
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
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${(isTemp || deleteIds.includes(todo.id)) && 'is-active'}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
