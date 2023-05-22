import { FC, useContext, useMemo } from 'react';
import classNames from 'classnames';
import { TodoContext } from '../contexts/TodoContext';
import { Filters } from '../types/Filters';
import { deleteTodo } from '../api/todos';

export const Footer: FC = () => {
  const {
    todos,
    setTodos,
    filter,
    setError,
    setFilter,
  } = useContext(TodoContext);

  const activeTodos = useMemo(() => (
    todos.filter((todo) => !todo.completed)
  ), [todos]);

  const completedTodos = useMemo(() => (
    todos.filter((todo) => todo.completed)
  ), [todos]);

  const handleDeleteCompleted = () => {
    const completedTodosIds = todos
      .filter((todo) => todo.completed)
      .map((todo) => todo.id);

    Promise.all(completedTodosIds.map((id) => deleteTodo(id)))
      .then(() => {
        setTodos(todos.filter((todo) => !todo.completed));
      })
      .catch(() => setError('Unable to delete a todo'));
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link',
            { selected: filter === 'all' })}
          onClick={() => setFilter(Filters.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link',
            { selected: filter === 'active' })}
          onClick={() => setFilter(Filters.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link',
            { selected: filter === 'completed' })}
          onClick={() => setFilter(Filters.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={handleDeleteCompleted}
        style={{ color: completedTodos.length > 0 ? 'inherit' : 'transparent' }}
      >
        Clear completed
      </button>
    </footer>
  );
};
