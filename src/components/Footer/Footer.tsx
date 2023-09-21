import React from 'react';
import classNames from 'classnames';
import { Filter } from '../../types/Filter';
import { useTodos } from '../../TodosContext';
import { deleteTodo } from '../../api/todos';

export const Footer: React.FC = () => {
  const {
    todos,
    filter,
    setFilter,
    setError,
    setTodos,
    setTempTodos,
  } = useTodos();
  const numberOfActiveTodos = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);
  const completedTodos = todos.filter(({ completed }) => completed === true);

  const handleClearComplete = async () => {
    try {
      setError('');
      setTempTodos(completedTodos);
      await Promise.all(completedTodos.map(async (todo) => {
        await deleteTodo(todo.id);
        setTodos(prevTodos => prevTodos
          .filter((item) => item.id !== todo.id));
      }));
    } catch (error) {
      setError('Unable to delete a todo');
      setTimeout(() => setError(''), 3000);
    } finally {
      setTempTodos([]);
    }
  };

  return todos.length
    ? (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {`${numberOfActiveTodos} items left`}
        </span>

        <nav className="filter" data-cy="Filter">
          {Object.keys(Filter).map((key) => {
            const value = Filter[key as keyof typeof Filter];

            return (
              <a
                key={key}
                data-cy={`FilterLink${key}`}
                href={`#/${value}`}
                className={classNames('filter__link', {
                  selected: value === filter,
                })}
                onClick={() => setFilter(value)}
              >
                {key}
              </a>
            );
          })}
        </nav>

        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          disabled={!hasCompleted}
          onClick={handleClearComplete}
        >
          Clear completed
        </button>
      </footer>
    ) : null;
};
