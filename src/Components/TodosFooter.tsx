import React from 'react';
import classNames from 'classnames';
import { ListAction } from '../Enum/ListAction';
import { useTodo } from '../Hooks/UseTodo';

export const TodosFooter: React.FC = () => {
  const {
    todos,
    setTodos,
    filter,
    setFilter,
  } = useTodo();
  const selectedTodos = todos.filter(todo => !todo.completed);
  const compleatedTodosLength = todos.filter(todo => todo.completed).length;

  const deleteTodos = () => {
    setTodos(selectedTodos);
  };

  return (
    <>
      {todos.length > 0 && (
        <footer className="todoapp__footer">
          <span className="todo-count">
            {selectedTodos.length === 1
              ? '1 item left'
              : `${selectedTodos.length} items left`}
          </span>

          <nav className="filter">
            <a
              href="#/"
              className={classNames(
                'filter__link',
                { selected: filter === ListAction.ALL },
              )}
              onClick={() => setFilter(ListAction.ALL)}
            >
              All
            </a>

            <a
              href="#/active"
              className={classNames(
                'filter__link',
                { selected: filter === ListAction.ACTIVE },
              )}
              onClick={() => setFilter(ListAction.ACTIVE)}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={classNames(
                'filter__link',
                { selected: filter === ListAction.COMPLETED },
              )}
              onClick={() => setFilter(ListAction.COMPLETED)}
            >
              Completed
            </a>
          </nav>

          <button
            type="button"
            className={classNames(
              'todoapp__clear-completed',
              {
                'is-invisible': !compleatedTodosLength,
              },
            )}
            onClick={deleteTodos}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
