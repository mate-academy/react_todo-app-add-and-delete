import React from 'react';
import classNames from 'classnames';
import { Loader } from '../Loader/Loader';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  removeTodo:(todoId: number) => void;
  changeProperty:(todoId: number, property: Partial<Todo>) => void;
  selectedTodoId: number;
  isToggling: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  changeProperty,
  selectedTodoId,
  isToggling,
}) => {
  const { id, title, completed } = todo;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => changeProperty(id, { completed: !completed })}
        />
      </label>

      <span
        data-cy="TodoTitle"
        className="todo__title"
      >
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => removeTodo(todo.id)}
      >
        ×
      </button>

      {(((selectedTodoId === todo.id)
      || (isToggling && todo.id === 0)) && (
        <Loader />
      ))}
    </div>
  );
};
