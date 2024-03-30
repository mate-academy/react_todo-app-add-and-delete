import classNames from 'classnames';

type Props = {
  isLoader?: boolean;
  isIncludesId?: boolean;
  id?: number;
};

export const TodoLoader: React.FC<Props> = ({
  isLoader = false,
  id,
  isIncludesId,
}) => {
  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal', 'overlay', {
        'is-active': isLoader || !id || isIncludesId,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
