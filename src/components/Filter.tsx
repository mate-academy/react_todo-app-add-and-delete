import React, { useContext } from 'react';
import cn from 'classnames';
import { FilterBy } from '../types/Todo';
import { TodosContext } from '../context/todosContext';
import { deleteTodo } from '../api/todos';

export const Filter: React.FC = () => {
  const {
    todos,
    filterBy,
    onDeleteTodo,
    setFilterBy,
    setErrorMessage,
    setDeletingCompletedTodo,
  } = useContext(TodosContext);

  const countActiveTodos = React.useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const isSomeTodosCompleted = React.useMemo(() => {
    return todos.length > countActiveTodos;
  }, [todos]);

  function onDeleteCompletedTodos() {
    const promises = todos.filter(todo => todo.completed)
      .map(todo => deleteTodo(todo.id));

    setDeletingCompletedTodo(true);

    Promise.all(promises)
      .then(() => todos.forEach(todo => {
        if (todo.completed) {
          onDeleteTodo(todo.id);
        }
      }))
      .catch(() => {
        setErrorMessage('Unable to delete completed todos');
        throw new Error('Unable to delete completed todos');
      })
      .finally(() => setDeletingCompletedTodo(false));
  }

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${countActiveTodos} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterBy === FilterBy.ALL,
          })}
          onClick={() => setFilterBy(FilterBy.ALL)}
        >
          All
        </a>

        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterBy === FilterBy.ACTIVE,
          })}
          onClick={() => setFilterBy(FilterBy.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterBy === FilterBy.COMPLETED,
          })}
          onClick={() => setFilterBy(FilterBy.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={!isSomeTodosCompleted}
        onClick={onDeleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
