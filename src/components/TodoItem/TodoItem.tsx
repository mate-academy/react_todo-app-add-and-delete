import classNames from 'classnames';
import { useContext } from 'react';
import { deleteTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { TodoContext } from '../../store/TodoContext';
import { ErrorContext } from '../../store/ErrorContext';
import { LoadingContext } from '../../store/LoadingContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { setTodos } = useContext(TodoContext);
  const { loadingIds, setLoadingIds } = useContext(LoadingContext);
  const { showError } = useContext(ErrorContext);

  const deleteTodoFromServer = async (skipLoading = false) => {
    if (!skipLoading) {
      setLoadingIds(prev => [...prev, todo.id]);
    }

    try {
      const response = await deleteTodo(todo.id);

      if (response === 0) {
        throw new Error('Invalid response from server');
      }

      setTodos(prev => prev.filter(t => t.id !== todo.id));
    } catch (err) {
      showError('Unable to delete a todo');
    } finally {
      if (!skipLoading) {
        setLoadingIds(prev => prev.filter(i => i !== todo.id));
      }
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
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
        data-cy="TodoDelete"
        onClick={() => deleteTodoFromServer(false)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': todo.id === 0 || loadingIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
