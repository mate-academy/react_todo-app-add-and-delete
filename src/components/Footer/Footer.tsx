import cn from 'classnames';
import { useContext, useMemo, useState } from 'react';
import { SortType, TodosContext } from '../TodosContext/TodosContext';
import { deleteTodo } from '../../api/todos';

export const Footer = () => {
  const {
    todos,
    setHasErrorMessage,
    setIsHiddenError,
    setFilterType,
    setTodos,
    setLoading,
  } = useContext(TodosContext);

  const [selectedFilter, setSelectedFilter] = useState(SortType.All);

  const completedTodos = todos.filter(({ completed }) => completed);
  const uncomplitedTodo = useMemo(() => {
    return todos.filter(({ completed }) => !completed);
  }, [todos]);

  const handleDeleteActiveTodo = async () => {
    try {
      const deletedTodos: number[] = [];

      completedTodos.forEach(({ id }) => {
        setLoading(id);
      });

      await Promise.all(
        todos.map(async ({ id, completed }) => {
          if (completed) {
            try {
              await deleteTodo(id);
              deletedTodos.push(id);
            } catch (error) {
              setHasErrorMessage('Unable to delete a todo');
              setIsHiddenError(true);
            }
          }
        }),
      );

      setTodos((prevState) => (
        prevState.filter(({ id }) => !deletedTodos.includes(id))
      ));
    } catch (error) {
      setHasErrorMessage('Unable to delete todos');
      setIsHiddenError(true);
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${uncomplitedTodo.length} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: selectedFilter === SortType.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => {
            setFilterType(SortType.All);
            setSelectedFilter(SortType.All);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: selectedFilter === SortType.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => {
            setFilterType(SortType.Active);
            setSelectedFilter(SortType.Active);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: selectedFilter === SortType.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => {
            setFilterType(SortType.Completed);
            setSelectedFilter(SortType.Completed);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={() => handleDeleteActiveTodo()}
        disabled={uncomplitedTodo.length === todos.length}
        style={{ opacity: completedTodos.length ? 1 : 0 }}
      >
        Clear completed
      </button>

      {/* don't show this button if there are no completed todos */}

    </footer>
  );
};
