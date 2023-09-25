type Props = {
  value: number;
};

export const TodoCounter:React.FC<Props> = ({ value }) => {
  const innerText = `${value} ${value === 1 ? 'item' : 'items'} left`;

  return (
    <span className="todo-count" data-cy="TodosCounter">
      {innerText}
    </span>
  );
};
