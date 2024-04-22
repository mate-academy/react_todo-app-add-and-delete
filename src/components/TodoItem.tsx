/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { useContext } from 'react';
import { TodoListContext } from '../variables/LangContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { updateTodo, deleteTodo, loadingTodoIds } =
    useContext(TodoListContext);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => updateTodo(todo)}
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title.trim()}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': loadingTodoIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
