import classNames from 'classnames';

type Props = {
  todoId: number;
  loadingTodoId: number | null;
};

export const TodoLoader: React.FC<Props> = ({ todoId, loadingTodoId }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': loadingTodoId === todoId,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
