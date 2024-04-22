/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { useContext } from 'react';
import { TodoListContext } from '../variables/LangContext';

type Props = {
  tempTodo: Todo;
};

export const TempTodoItem: React.FC<Props> = ({ tempTodo }) => {
  const { updateTodo } = useContext(TodoListContext);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: tempTodo.completed,
      })}
      key={tempTodo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => updateTodo(tempTodo)}
          checked={tempTodo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {tempTodo.title.trim()}
      </span>
      <button type="button" className="todo__remove" data-cy="TodoDelete">
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': tempTodo,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
