import classNames from 'classnames';
import React from 'react';

type Props = {
  todoTitle: string;
  isSelected: boolean;
  loading: boolean;
  deleteTodo?: () => void;
  onDoubleClick?: () => void;
};

export const TodoCard: React.FC<Props> = (
  {
    todoTitle,
    isSelected,
    loading,
    onDoubleClick,
    deleteTodo,
  },
) => {
  return (
    <>
      <span
        className="todo__title"
        onDoubleClick={onDoubleClick}

      >
        {todoTitle}
      </span>
      <button
        type="button"
        className="todo__remove"
        onClick={deleteTodo}
      >
        ×

      </button>

      <div className={classNames('modal overlay', {
        'is-active': loading && isSelected,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

    </>
  );
};
