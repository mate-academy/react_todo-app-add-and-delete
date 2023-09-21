import React from 'react';
import classNames from 'classnames';
import { TodoType } from '../../types/TodoType';
import { TodoCard } from '../TodoCard';
import { Toggler } from '../Toggler';

type Props = {
  todo: TodoType
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

    </div>

  );
};
