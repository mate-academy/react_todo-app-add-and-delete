import cn from 'classnames';
import { useTodo } from '../providers/AppProvider';

export const Loader = () => {
  const { isLoading } = useTodo();

  return (
    <div
      data-cy="TodoLoader"
      className={cn('modal overlay', {
        'is-active': isLoading,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
