import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { useContext } from 'react';
import { TodosContext } from '../todosContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { setTodos, todos, loadingIds, deleteChackedTodo } =
    useContext(TodosContext);
  const isActiveLoading = loadingIds.includes(todo.id) || todo.id === 0;

  const onClickButtonDelete = (todoId: number) => {
    deleteChackedTodo(todoId);
  };

  const handleTodoCheckbox = (id: number) => {
    const todosUpdated = todos.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item,
    );

    setTodos([...todosUpdated]);
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          id="todoCheckbox"
          checked={todo.completed}
          onChange={() => handleTodoCheckbox(todo.id)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onClickButtonDelete(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isActiveLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
