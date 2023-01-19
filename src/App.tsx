/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  memo,
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import cn from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { TodoList } from './components/TodoList';
import { FilterTypes } from './types/FilterTypes';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = memo(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFilterType, setSelectedFilterType] = useState(FilterTypes.ALL);

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);

    setTimeout(() => {
      showErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then((loadedTodos) => {
          setTodos(loadedTodos);
        })
        .catch(() => {
          showErrorMessage('Can\'t load todos!');
        });
    }
  }, []);

  const visibleTodoos = useMemo(() => {
    return todos.filter(todo => {
      switch (selectedFilterType) {
        case FilterTypes.ACTIVE:
          return !todo.completed;

        case FilterTypes.COMPLETED:
          return todo.completed;

        case FilterTypes.ALL:
        default:
          return true;
      }
    });
  }, [todos, selectedFilterType]);

  const filterOptions = Object.values(FilterTypes);

  const activeItemsCounter = useMemo(() => {
    return todos.filter(({ completed }) => !completed).length;
  }, [todos]);

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

        {todos.length > 0 && (
          <>
            <TodoList todos={visibleTodoos} />

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="todosCounter">
                {`${activeItemsCounter} items left`}
              </span>

              <nav className="filter" data-cy="Filter">
                {filterOptions.map(option => (
                  <a
                    data-cy="FilterLinkAll"
                    href="#/"
                    className={cn(
                      'filter__link',
                      { selected: selectedFilterType === option },
                    )}
                    onClick={() => setSelectedFilterType(option)}
                  >
                    {option}
                  </a>
                ))}
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

      <ErrorNotification
        errorMessage={errorMessage}
        onCloseBtnClick={() => setErrorMessage('')}
      />
    </div>
  );
});
