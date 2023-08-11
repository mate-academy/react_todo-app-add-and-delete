import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  isLoading: boolean,
  handleDeleteTodo: (id: number) => () => void,
  selectedTodo: Todo | null,
  setSelectedTodo: (todo: Todo) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  handleDeleteTodo,
  selectedTodo,
  setSelectedTodo,
}) => {
  const { title, completed, id } = todo;

  const handleDeleteItem = (todoId: number) => () => {
    handleDeleteTodo(todoId)();

    setSelectedTodo(todo);
  };

  return (
    <div className={classNames('todo', {
      completed,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={handleDeleteItem(id)}
      >
        ×
      </button>

      <div className={classNames('modal overlay', {
        'is-active': isLoading && (id === selectedTodo?.id || id === 0),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
