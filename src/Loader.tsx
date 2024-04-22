import cn from 'classnames';
import { useContext } from 'react';
import { ContextTodos } from './TodoContext';

type Props = {
  todoId: number;
};

export const Loader = ({ todoId }: Props) => {
  const { isLoading } = useContext(ContextTodos);

  return (
    <div
      data-cy="TodoLoader"
      className={cn('modal overlay', {
        'is-active': isLoading.includes(todoId),
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
