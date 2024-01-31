import cn from 'classnames';
import { Dispatch, SetStateAction } from 'react';
import { Todo } from '../types/Todo';
import { ShowState } from '../types/ShowState';
import { deleteTodo } from '../api/todos';
import { ErrorTypes } from '../types/ErrorTypes';

type Props = {
  todos: Todo[],
  showState: ShowState,
  setShowState: Dispatch<SetStateAction<ShowState>>;
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  setError: Dispatch<SetStateAction<ErrorTypes | null>>,
};

const checkCompletedTodos = (todoss: Todo[]) => todoss
  .some(todo => todo.completed);

export const Footer: React.FC<Props> = ({
  todos,
  showState,
  setShowState,
  setTodos,
  setError,
}) => {
  const handleClear = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const notCompletedTodos = todos.filter(todo => !todo.completed);

    try {
      const completeIds = completedTodos
        .map(({ id }) => deleteTodo(12177, id));

      await Promise.all(completeIds);

      setTodos(notCompletedTodos);
    } catch {
      setError(ErrorTypes.UPDATE_TODO);
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
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
