import { useContext } from 'react';
import cn from 'classnames';

import { TodosContext } from '../TodoContext/TodoContext';
import { filters } from '../../utils/filters';

export const TodoFooter = () => {
  const {
    filter,
    setFilter,
    todos,
    removeTodo,
  } = useContext(TodosContext);

  const todosLeft = todos.filter(todo => !todo.completed).length;

  const handleClearCompleted = () => {
    const removePromises = todos
      .filter(todo => todo.completed)
      .map(todo => removeTodo(todo.id));

    Promise.all(removePromises);
  };

  return (
    <>
      {!!todos.length && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {`${todosLeft} items left`}
          </span>

          <nav className="filter" data-cy="Filter">
            {filters.map(({ href, status, data }) => (
              <a
                href={href}
                className={cn('filter__link', {
                  selected: status === filter,
                })}
                onClick={() => setFilter(status)}
                key={status}
                data-cy={data}
              >
                {status}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            onClick={handleClearCompleted}
            disabled={todosLeft === todos.length}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
