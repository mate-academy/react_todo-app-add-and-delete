import cn from 'classnames';

type TodoLoaderProps = {
  isActive: boolean;
};

export const TodoLoader: React.FC<TodoLoaderProps> = ({ isActive }) => (
  <div
    data-cy="TodoLoader"
    className={cn('modal overlay', {
      'is-active': isActive,
    })}
  >
    <div
      className="modal-background has-background-white-ter"
    />
    <div className="loader" />
  </div>
);
