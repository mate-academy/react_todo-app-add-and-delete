/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { updateTodo } from '../../api/todos';
import { useTodosContext } from '../../context/context';

interface Props {
  todo: Todo;
}

export const TodoItem: FC<Props> = ({ todo }) => {
  const {
    setTodoLoading,
    setErrorMessage,
    setTodos,
    todoLoadingStates,
    handleDelete,
  } = useTodosContext();

  const onSelectInputChange = async () => {
    const { id, completed } = todo;
    const newStatus = !completed;

    try {
      setTodoLoading(id, true);
      setErrorMessage('');
      await updateTodo(id, newStatus);
      setTodos(prevTodos => {
        return prevTodos.map(item =>
          item.id === id ? { ...item, completed: newStatus } : item,
        );
      });
    } catch (error) {
      setErrorMessage('Something went wrong');
    } finally {
      setTodoLoading(id, false);
    }
  };

  const { id, completed, title } = todo;

  return (
    <div
      key={id}
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={onSelectInputChange}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDelete(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': todoLoadingStates[id] || false,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
