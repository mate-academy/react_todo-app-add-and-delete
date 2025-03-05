import classNames from 'classnames';

export const TodoLoader: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': isActive,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
