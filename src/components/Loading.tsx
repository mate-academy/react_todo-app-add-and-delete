import classNames from 'classnames';

interface Props {
  isLoading: boolean;
  loadingTodo: number[];
  todoId: number;
}

export const Loading: React.FC<Props> = ({
  isLoading,
  loadingTodo,
  todoId,
}) => {
  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': isLoading || loadingTodo.includes(todoId),
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
