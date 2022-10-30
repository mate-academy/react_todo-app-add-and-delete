import classNames from 'classnames';

type Props = {
  isAdding?: boolean,
};

export const Loader: React.FC<Props> = ({ isAdding }) => (
  <div
    data-cy="TodoLoader"
    className={classNames(
      'modal overlay',
      { 'is-active': isAdding },
    )}
  >
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
);
