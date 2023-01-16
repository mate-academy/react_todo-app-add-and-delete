import cn from 'classnames';

type Props = {
  isActive?: boolean
};

export const TodoLoader: React.FC<Props> = ({ isActive }) => {
  return (
    <div
      data-cy="TodoLoader"
      // className="modal overlay"
      className={cn(
        'modal overlay',
        { 'is-active': isActive },
      )}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
