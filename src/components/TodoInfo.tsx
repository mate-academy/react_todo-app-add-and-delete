import { FC } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo
};

export const TodoInfo: FC<Props> = ({ todo }) => {
  return (
    <span data-cy="TodoTitle" className="todo__title">
      {todo.title}
    </span>

  );
};
