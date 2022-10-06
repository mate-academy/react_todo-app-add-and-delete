import classNames from 'classnames';

type Props = {
  isActive?: boolean,
};

export const Loader: React.FC<Props> = ({ isActive }) => (
  <div
    data-cy="TodoLoader"
    className={classNames(
      'modal overlay',
      { 'is-active': isActive },
    )}
  >
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
);
