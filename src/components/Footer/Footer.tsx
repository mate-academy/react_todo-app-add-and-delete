import { useContext } from 'react';
import { TodosContext } from '../TodosContext';
import { TodosFilter } from '../TodosFilter';

type Props = {};
export const Footer: React.FC<Props> = () => {
  const { todos } = useContext(TodosContext);

  const count = todos.filter(({ completed }) => !completed).length;
  const isComletedTodos = todos.some(({ completed }) => completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {count > 1 ? (
          `${count} items left`
        ) : (
          `${count} item left`
        )}
      </span>

      <TodosFilter />

      {isComletedTodos && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
