import React from 'react';
import classNames from 'classnames';
import { ITodo } from '../../types/Todo';
import { TodoCard, Toggler } from '../common';

type Props = {
  todo: ITodo
  loading: boolean;

};

export const TempTodo: React.FC<Props> = (
  {
    todo: { title, completed },
    loading = false,
  },
) => {
  return (
    <div className={
      classNames('todo', {
        completed,
      })
    }
    >
      <Toggler
        completed={completed}
      />

      <TodoCard
        todoTitle={title}
        loading={loading}
        isSelected
      />

      <div className={classNames('modal overlay', {
        'is-active': loading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

    </div>

  );
};
