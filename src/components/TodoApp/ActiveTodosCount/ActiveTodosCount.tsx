type Props = {
  activeCount: number;
};

export const ActiveTodosCount: React.FC<Props> = ({ activeCount }) => {
  return (
    <span className="todo-count" data-cy="TodosCounter">
      {`${activeCount} items left`}
    </span>
  );
};
