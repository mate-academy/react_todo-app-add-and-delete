/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
// import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { ErrorNotification } from './components/ErrorNotification';
import { SortType } from './types/filterBy';

function filterTodos(
  todos: Todo[],
  sortType: SortType,
) {
  const visibleTodos = [...todos];

  switch (sortType) {
    case SortType.Active:
      return visibleTodos.filter(todo => !todo.completed);

    case SortType.Completed:
      return visibleTodos.filter(todo => todo.completed);
    default:
      return visibleTodos;
  }
}

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortType, setSortType] = useState<SortType>(SortType.All);
  const [completeItem, setCompleteItem] = useState<number>(0);
  const [selectedLink, setSelectedLink] = useState<string>('All');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    getTodos(5)
      .then(todosFromServer => setTodos(todosFromServer))
      .catch(() => setErrorMessage('Unable to update todos'));
  }, []);

  useEffect(() => {
    todos.map(todo => {
      if (!todo.completed) {
        setCompleteItem(prev => prev + 1);
      }

      return 0;
    });
  }, [todos]);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const visibleTodos = filterTodos(todos, sortType);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
          />

          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        {todos && (
          <>
            <TodoList todos={visibleTodos} />

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="todosCounter">
                {`${completeItem} items left`}
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  data-cy="FilterLinkAll"
                  href="#/"
                  className={classNames(
                    'filter__link',
                    { selected: selectedLink === 'All' },
                  )}
                  onClick={() => {
                    setSortType(SortType.All);
                    setSelectedLink('All');
                  }}
                >
                  All
                </a>

                <a
                  data-cy="FilterLinkActive"
                  href="#/active"
                  className={classNames(
                    'filter__link',
                    { selected: selectedLink === 'Active' },
                  )}
                  onClick={() => {
                    setSortType(SortType.Active);
                    setSelectedLink('Active');
                  }}
                >
                  Active
                </a>
                <a
                  data-cy="FilterLinkCompleted"
                  href="#/completed"
                  className={classNames(
                    'filter__link',
                    { selected: selectedLink === 'Completed' },
                  )}
                  onClick={() => {
                    setSortType(SortType.Completed);
                    setSelectedLink('Completed');
                  }}
                >
                  Completed
                </a>
              </nav>

              <button
                data-cy="ClearCompletedButton"
                type="button"
                className="todoapp__clear-completed"
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      {errorMessage && (
        <ErrorNotification errorMessage={errorMessage} />
      )}
    </div>
  );
};
