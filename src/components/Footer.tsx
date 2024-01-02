import { FC } from 'react';
import cn from 'classnames';
import { useAppContext } from '../context/AppContext';
import { Filter } from '../types';
import { removeTodo } from '../api/todos';

export const Footer: FC = () => {
  const {
    todos,
    selectedFilter,
    handleFilterChange,
    loadData,
    setErrorMessage,
    setShowError,
    setTodosBeingoLoaded,
  } = useAppContext();

  const handleClearCompleted = async () => {
    const completedTodosId = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setTodosBeingoLoaded(prev => ([
      ...prev,
      ...completedTodosId,
    ]));

    try {
      await Promise.all(completedTodosId.map(id => removeTodo(id)));
      await loadData();
    } catch (error) {
      setErrorMessage('Unable to remove completed todos');
      setShowError(true);
    } finally {
      setTodosBeingoLoaded([]);
    }
  };

  const activeTodosNum = todos.reduce((acc, curr) => {
    return !curr.completed
      ? acc + 1
      : acc;
  }, 0);

  const completedTodosNum = todos.length - activeTodosNum;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        { `${activeTodosNum} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          id={Filter.all}
          href="#/"
          className={cn('filter__link', {
            selected: selectedFilter === Filter.all,
          })}
          data-cy="FilterLinkAll"
          onClick={handleFilterChange}
        >
          {Filter.all}
        </a>

        <a
          id={Filter.active}
          href="#/active"
          className={cn('filter__link', {
            selected: selectedFilter === Filter.active,
          })}
          data-cy="FilterLinkActive"
          onClick={handleFilterChange}
        >
          {Filter.active}
        </a>

        <a
          id={Filter.completed}
          href="#/completed"
          className={cn('filter__link', {
            selected: selectedFilter === Filter.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={handleFilterChange}
        >
          {Filter.completed}
        </a>
      </nav>

      <button
        onClick={handleClearCompleted}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodosNum <= 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
