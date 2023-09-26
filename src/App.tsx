/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useMemo, useState,
} from 'react';
import classNames from 'classnames';

import { TodoList } from './components/TodoList';
import { TodoContext } from './components/TodoProvider';
import { Form } from './components/Form';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';

enum FilterOption {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const App: React.FC = () => {
  const [filter, setFilter] = useState<string>(FilterOption.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const {
    todos,
    setErrorMessage,
    errorMessage,
    updateTodoHandler,
  } = useContext(TodoContext);

  const filteredTodos = useMemo(() => {
    return todos.filter(({ completed }) => {
      switch (filter) {
        case FilterOption.Active:
          return !completed;
        case FilterOption.Completed:
          return completed;
        case FilterOption.All:
        default:
          return true;
      }
    });
  }, [filter, todos]);

  const activeTodos = useMemo(() => {
    return todos.filter(({ completed }) => !completed);
  }, [todos]);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (errorMessage) {
      timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [errorMessage]);

  const onToggleAll = async () => {
    if (activeTodos.length) {
      activeTodos.forEach(
        currentTodo => updateTodoHandler(currentTodo, { completed: true }),
      );
    } else {
      todos.forEach(
        currentTodo => updateTodoHandler(currentTodo, { completed: false }),
      );
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todos.length
            && (
              <button
                type="button"
                className={classNames(
                  'todoapp__toggle-all',
                  { active: !activeTodos.length },
                )}
                data-cy="ToggleAllButton"
                onClick={onToggleAll}
              />
            )}

          <Form setTempTodo={setTempTodo} />
        </header>

        {!!filteredTodos.length
          && <TodoList todos={filteredTodos} tempTodo={tempTodo} />}

        {!!todos.length
          && (
            <Footer
              activeTodos={activeTodos}
              filter={filter}
              FilterOption={FilterOption}
              setFilter={setFilter}
            />
          )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
