import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { deleteTodo } from '../api/todos';
import { useTodosContext } from './useTodosContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    setTodos,
    handleError,
    setLoadingTodosIds,
    loadingTodosIds,
    setIsInputFocused,
  } = useTodosContext();

  const handleTodoDelete = (todoId: number) => {
    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(currentTodo => currentTodo.id !== todoId),
        );
        setLoadingTodosIds(currentIds =>
          currentIds.filter(id => id !== todoId),
        );
        setIsInputFocused(true);
      })
      .catch(() => {
        handleError('Unable to delete a todo');
        setLoadingTodosIds(currentIds =>
          currentIds.filter(id => id !== todoId),
        );
        setIsInputFocused(true);
      });

    setLoadingTodosIds(currentIds => [...currentIds, todoId]);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label" aria-label="todo__status">
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
        data-cy="TodoDelete"
        onClick={() => handleTodoDelete(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingTodosIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
