type Props = {
  value: number;
};

export const TodoCounter:React.FC<Props> = ({ value }) => (
  <span className="todo-count" data-cy="TodosCounter">
    {`${value} items left`}
  </span>
);
