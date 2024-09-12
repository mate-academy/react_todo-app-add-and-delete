type Props = {
  deletingList?: number[] | null;
  todoId: number;
};

export const Loader: React.FC<Props> = ({ deletingList, todoId }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={
        'modal overlay' +
        (todoId === 0 || deletingList?.includes(todoId) ? ' is-active' : '')
      }
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
