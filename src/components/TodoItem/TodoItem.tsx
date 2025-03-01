import { Loader } from '../Loader/Loader';

/* eslint-disable jsx-a11y/label-has-associated-control */
type Props = {
  title: string;
  id: number | null;
  loader: number | null;
};

export const TodoItem: React.FC<Props> = ({ title, loader, id }) => {
  const checked = id ?? -1;

  return (
    <div data-cy="Todo" className="todo">
      <label className="todo__status-label">
        <input data-cy="TodoStatus" type="checkbox" className="todo__status" />
      </label>
      <div data-cy="TodoTitle" className="todo__title">
        {title}
      </div>
      <Loader loader={loader} id={checked} />
    </div>
  );
};
