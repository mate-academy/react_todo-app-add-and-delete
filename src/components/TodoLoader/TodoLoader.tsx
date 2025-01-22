import classNames from 'classnames';

type Props = {
  isActiveLoader: boolean;
};

export const TodoLoader: React.FC<Props> = ({ isActiveLoader }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal', 'overlay', {
        'is-active': isActiveLoader,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
