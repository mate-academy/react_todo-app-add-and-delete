import classNames from 'classnames';

type Props = {
  loadingIds: number[];
  todoId: number;
};

export const Loader = ({ loadingIds, todoId }: Props) => {
  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': loadingIds.includes(todoId),
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
