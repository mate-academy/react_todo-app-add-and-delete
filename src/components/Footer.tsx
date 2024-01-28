import cn from 'classnames';
import { Dispatch, SetStateAction } from 'react';
import { Todo } from '../types/Todo';
import { ShowState } from '../types/ShowState';

type Props = {
  todos: Todo[],
  showState: ShowState,
  setShowState: Dispatch<SetStateAction<ShowState>>;
  setTodos: Dispatch<SetStateAction<Todo[]>>,
};

const checkCompletedTodos = (todoss: Todo[]) => todoss
  .some(todo => todo.completed);

export const Footer: React.FC<Props> = ({
  todos,
  showState,
  setShowState,
  setTodos,
}) => {
  const handleClear = () => {
    const newTodos = todos.filter(todo => !todo.completed);

    setTodos(newTodos);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.filter(toddo => !toddo.completed).length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          data-cy="FilterLinkAll"
          className={cn('filter__link', {
            selected: showState === ShowState.All,
          })}
          onClick={() => setShowState(ShowState.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: showState === ShowState.Active,
          })}
          onClick={() => setShowState(ShowState.Active)}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: showState === ShowState.Completed,
          })}
          onClick={() => setShowState(ShowState.Completed)}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClear}
        style={{
          visibility: checkCompletedTodos(todos) ? 'visible' : 'hidden',
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
