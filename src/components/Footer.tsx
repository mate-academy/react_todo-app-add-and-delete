import { useContext } from 'react';
import cn from 'classnames';

import { TodoFilter } from '../enums/TodoFilter';
import { TodoError } from '../enums/TodoError';
import { TodoContext } from '../contexts/TodoContext';
import { deleteTodo } from '../api/todos';

const filters: TodoFilter[] = [
  TodoFilter.All,
  TodoFilter.Active,
  TodoFilter.Completed,
];

export const Footer = () => {
  const {
    filter,
    setFilter,
    todos,
    setTodos,
    setError,
  } = useContext(TodoContext);

  const isPresentCompleted = todos.some(todo => todo.completed);

  const handleClearCompleted = () => {
    const completedTodosIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    completedTodosIds.forEach(id => {
      deleteTodo(id)
        .then(() => {
          setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
        })
        .catch(() => {
          setError(TodoError.Delete);
        });
    });
  };

  const todosRemaining = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosRemaining} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(filterType => (
          <a
            key={filterType}
            href={`#/${filter !== TodoFilter.All
              ? filter.toLowerCase()
              : ''}`}
            className={cn(
              'filter__link',
              {
                selected: filter === filterType,
              },
            )}
            data-cy={`FilterLink${filterType}`}
            onClick={() => setFilter(filterType)}
          >
            {filterType}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isPresentCompleted}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
