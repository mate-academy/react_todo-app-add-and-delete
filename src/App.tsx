/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  useEffect, useMemo, useState,
} from 'react';
import * as todoService from './api/todos';
import { ErrorNotification } from './components/TodoError';
import { TodoFilter } from './components/TodoFilter';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { Error } from './types/Error';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { USER_ID } from './utils/constant';
import { getVisibleTodos } from './utils/getVisibleTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Error>(Error.none);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const visibleTodos = useMemo(() => (
    getVisibleTodos(todos, filter)
  ), [todos, filter]);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(Error.load));
  }, []);

  const numberOfTodos = useMemo(() => visibleTodos.length, [visibleTodos]);

  const hasActiveTodos = useMemo(() => (
    visibleTodos.some(todo => !todo.completed)
  ), [visibleTodos]);

  const completedTodos = useMemo(() => (
    visibleTodos.filter(todo => todo.completed)
  ), [visibleTodos]);

  const deleteTodo = (todoId: number): Promise<void> => {
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));

    return todoService.removeTodo(todoId)
      .catch(() => {
        setTodos(todos);
        setErrorMessage(Error.delete);
      });
  };

  const deleteCompletedTodos = () => {
    completedTodos.forEach(completedTodo => {
      deleteTodo(completedTodo.id);
    });
  };

  const addTodo = ({ title, userId, completed }: Todo) => {
    setErrorMessage(Error.none);

    return todoService.createTodo({ title, userId, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch((error) => {
        setErrorMessage(Error.add);
        throw error;
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {numberOfTodos > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: hasActiveTodos,
              })}
            />
          )}

          {/* Add a todo on form submit */}
          <TodoForm
            addTodo={addTodo}
            setErrorMessage={setErrorMessage}
            setTempTodo={setTempTodo}
          />
        </header>

        {numberOfTodos > 0 && (
          <TodoList
            todos={visibleTodos}
            deleteTodo={deleteTodo}
            tempTodo={tempTodo}
          />
        )}

        {numberOfTodos > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {numberOfTodos === 1 ? (
                `${numberOfTodos} item left`
              ) : (
                `${numberOfTodos} items left`
              )}
            </span>

            <TodoFilter
              filter={filter}
              setFilter={setFilter}
            />

            <button
              type="button"
              className="todoapp__clear-completed"
              onClick={deleteCompletedTodos}
            >
              {completedTodos.length > 0 && (
                'Clear completed'
              )}
            </button>

          </footer>
        )}
      </div>

      {errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
