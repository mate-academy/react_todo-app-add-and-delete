import cn from 'classnames';
import { FilteredState } from '../types/FilteredState';
import { Todo } from '../types/Todo';

type Props = {
  OnFilteredState: FilteredState
  onSetFilteredState: (value: FilteredState) => void
  todos: Todo[]
  onDeleteTodo: (value: number) => void
};

export const Footer: React.FC<Props>
  // eslint-disable-next-line object-curly-newline
  = ({ OnFilteredState, onSetFilteredState, todos, onDeleteTodo }) => {
    const completedTodos = todos.filter(todo => todo.completed);

    const todosLeft = todos.filter(todo => !todo.completed);

    return (
      <footer className="todoapp__footer">
        <span className="todo-count">
          {`${todosLeft.length} items left`}
        </span>

        <nav className="filter">
          <a
            href="#/"
            className={cn(
              'filter__link ',
              { selected: OnFilteredState === FilteredState.All },
            )}
            onClick={() => onSetFilteredState(FilteredState.All)}
          >
            All
          </a>

          <a
            href="#/active"
            className={cn(
              'filter__link ',
              { selected: OnFilteredState === FilteredState.Active },
            )}
            onClick={() => onSetFilteredState(FilteredState.Active)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={cn(
              'filter__link ',
              { selected: OnFilteredState === FilteredState.Completed },
            )}
            onClick={() => onSetFilteredState(FilteredState.Completed)}

          >
            Completed
          </a>
        </nav>
        {todos.find(todo => todo.completed) && (
          <button
            type="button"
            className="todoapp__clear-completed"
            onClick={() => {
              completedTodos.forEach(todo => {
                onDeleteTodo(todo.id);
              });
            }}

          >
            Clear completed
          </button>

        )}
      </footer>
    );
  };
