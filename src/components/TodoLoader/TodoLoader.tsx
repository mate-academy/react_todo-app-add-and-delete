import classNames from 'classnames';

interface Props {
  isActive: boolean;
}

export const TodoLoader: React.FC<Props> = ({ isActive }) => (
  <div
    data-cy="TodoLoader"
    className={classNames('modal overlay', { 'is-active': isActive })}
  >
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
);
