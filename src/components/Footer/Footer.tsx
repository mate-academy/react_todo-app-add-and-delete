import { Todo } from '../../types/Todo';
import { Filter } from '../Filter';

type Props = {
  data: Todo[];
  setFilter: (value: string) => void;
  clearCompeleted: () => void;
};

export const Footer: React.FC<Props> = ({
  data,
  setFilter,
  clearCompeleted,
}) => {
  const counter = data
    .filter(todo => {
      return todo.completed !== true;
    })
    .filter(todo => {
      return !todo.hasOwnProperty('temp');
    });

  const completedLength = [...data].filter(
    item => item.completed === true,
  ).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {counter.length} items left
      </span>

      <Filter setFilter={setFilter} />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedLength > 0 ? false : true}
        onClick={event => {
          event.preventDefault();

          clearCompeleted();
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
