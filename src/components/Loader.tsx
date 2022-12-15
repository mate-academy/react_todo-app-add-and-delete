import classNames from 'classnames';

type Props = {
  onLoad: boolean;
};

export const Loader: React.FC<Props> = ({ onLoad }) => (
  <div
    data-cy="TodoLoader"
    className={classNames('modal overlay', {
      'is-active': onLoad,
    })}
  >
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
);
