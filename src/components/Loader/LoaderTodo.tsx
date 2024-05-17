import { FC } from 'react';
import cn from 'classnames';

interface IProps {
  loading: boolean;

  isLoading: boolean;
}

export const LoaderTodo: FC<IProps> = ({
  loading,

  isLoading,
}) => {
  return (
    <div
      data-cy="TodoLoader"
      className={cn('modal overlay', {
        'is-active': isLoading || loading,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
