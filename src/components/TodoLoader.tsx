import classNames from 'classnames';

type Props = {
  todoId: number;
  updatingTodoIds: number[];
};

export const TodoLoader: React.FC<Props> = ({ todoId, updatingTodoIds }) => {
  const isUpdating = updatingTodoIds.includes(todoId);

  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': isUpdating,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
