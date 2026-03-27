import classNames from 'classnames';
import React from 'react';
import { useContext } from 'react';
import { Filter } from '../../types/Filters';
import { TodoContext } from '../../store/TodoContext';
import { ErrorContext } from '../../store/ErrorContext';
import { deleteTodo } from '../../api/todos';
import { LoadingContext } from '../../store/LoadingContext';

type Props = {
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
};

export const Footer: React.FC<Props> = ({ filter, setFilter }) => {
  const { todos, setTodos } = useContext(TodoContext);
  const { setLoadingIds } = useContext(LoadingContext);
  const { showError } = useContext(ErrorContext);

  const filters: Filter[] = ['All', 'Active', 'Completed'];
  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.length - activeCount;

  const deleteAllCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (!completedTodos.length) {
      return;
    }

    const idsToDelete = completedTodos.map(todo => todo.id);

    setLoadingIds(idsToDelete);

    const results = await Promise.allSettled(
      idsToDelete.map(id => deleteTodo(id)),
    );

    const deletedIds = results
      .map((r, i) =>
        r.status === 'fulfilled' && r.value === 1
          ? idsToDelete[i]
          : showError('Unable to delete a todo'),
      )
      .filter(Boolean);

    setTodos(prev => prev.filter(t => !deletedIds.includes(t.id)));

    setLoadingIds([]);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} item{activeCount !== 1 ? 's' : ''} left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {filters.map(item => {
          return (
            <a
              key={item}
              href={`#/${item}`}
              data-cy={`FilterLink${item}`}
              className={classNames('filter__link', {
                selected: filter === item,
              })}
              onClick={() => setFilter(item)}
            >
              {item}
            </a>
          );
        })}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedCount === 0}
        onClick={deleteAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
