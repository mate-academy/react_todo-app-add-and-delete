/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { getTodos, postTodos, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { FilterBy } from './types/FilterBy';
import { getFilteredTodos } from './helpers/getFilteredTodos';
import { TodoList } from './components/TodoList';

const USER_ID = 10775;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(FilterBy.ALL);
  const [isError, setIsError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [disableInput, setDisableInput] = useState(false);
  const [loadingTodo, setLoadingTodo] = useState([0]);

  useEffect(() => {
    getTodos(USER_ID)
      .then((loadedTodos: Todo[]) => {
        setTodos(loadedTodos);
      })
      .catch((loadedError: Error) => {
        setIsError(loadedError?.message ?? 'Error');
      });
  }, []);

  useEffect(() => {
    if (isError) {
      setTimeout(() => {
        setIsError(null);
      }, 3000);
    }
  }, [isError]);

  const addTodo = async (todoTitle: string) => {
    try {
      const newTodo = {
        userId: USER_ID,
        title: todoTitle,
        completed: false,
      };

      setTempTodo({
        id: 0,
        ...newTodo,
      });

      const createdTodo = await postTodos(newTodo);

      setTodos(currentTodos => [...currentTodos, createdTodo]);
    } catch {
      setIsError('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputValue) {
      setIsError('Title can not be empty');

      return;
    }

    try {
      setDisableInput(true);
      await addTodo(inputValue);
    } catch {
      setIsError('Unable to add a todo');
    } finally {
      setDisableInput(false);
      setInputValue('');
    }
  };

  const removeTodo = async (id: number) => {
    try {
      setLoadingTodo(prevTodoId => [...prevTodoId, id]);
      await deleteTodo(id);

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch {
      setIsError('Unable to delete a todo');
    } finally {
      setTempTodo(null);
      setLoadingTodo([0]);
    }
  };

  const handleClearCompleted = () => {
    todos.forEach(async (todo) => {
      if (todo.completed) {
        await removeTodo(todo.id);
      }
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = getFilteredTodos(todos, filterBy);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          {(todos.length > 0) && (
            <button type="button" className="todoapp__toggle-all active" />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              disabled={disableInput}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            removeTodo={removeTodo}
            tempTodo={tempTodo}
            loadingTodo={loadingTodo}
          />
        )}

        {(todos.length > 0) && (
          <Footer
            todos={todos}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <div
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !isError },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setIsError(null)}
        />
        {isError}
      </div>
    </div>
  );
};
