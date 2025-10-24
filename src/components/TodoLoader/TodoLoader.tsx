import cn from 'classnames';

type Prop = {
  isActive: boolean;
};

export const TodoLoader: React.FC<Prop> = ({ isActive }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={cn('modal overlay', {
        'is-active': isActive,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
