import cn from 'classnames';

type Props = {
  isActive?: boolean,
  isDeleting?: boolean,
};

export const TodoLoader: React.FC<Props> = ({
  isActive,
  isDeleting,
}) => {
  return (
    <div
      data-cy="TodoLoader"
      className={cn(
        'modal overlay',
        { 'is-active': isActive || isDeleting },
      )}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
