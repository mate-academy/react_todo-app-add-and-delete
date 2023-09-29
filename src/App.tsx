/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from './types/Todo';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorNotification } from
  './components/ErrorNotification/ErrorNotification';
import { TodoItem } from './components/Todo';

const USER_ID = 11562;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(response => {
        setTodos(response as Todo[]);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, []);

  let remainingTodos = todos.filter(todo => !todo.completed).length;
  const activeTodos = todos.filter(todo => todo.completed).length;

  useEffect(() => {
    remainingTodos = todos.filter(todo => !todo.completed).length;

    switch (filter) {
      case 'active':
        setVisibleTodos(todos.filter(todo => !todo.completed));
        break;

      case 'completed':
        setVisibleTodos(todos.filter(todo => todo.completed));
        break;

      default:
        setVisibleTodos(todos.filter(todo => todo));
        break;
    }
  }, [filter, todos]);

  const handleDeleteTodo = (id: number) => {
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
  };

  const handleAddTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query.trim()) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } else {
      const newTodo: Todo = {
        id: 0,
        userId: USER_ID,
        title: query.trim(),
        completed: false,
      };

      setIsDisabled(true);
      setTempTodo(newTodo);

      addTodo(newTodo)
        .then(response => {
          setTodos(currentTodos => [...currentTodos, response]);
          setTempTodo(null);
          setQuery('');
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');
          setTimeout(() => {
            setErrorMessage('');
          }, 3000);
        })
        .finally(() => {
          setIsDisabled(false);
          setTempTodo(null);
        });
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDisabled]);

  const handleClearAll = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id)
          .then(() => {
            handleDeleteTodo(todo.id);
          })
          .catch(() => {
            setErrorMessage('Unable to delete a todo');
            setTimeout(() => {
              setErrorMessage('');
            }, 3000);
          });
      }
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          {todos.length > 0 && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              data-cy="ToggleAllButton"
            />
          )}

          <form onSubmit={(event) => handleAddTodo(event)}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              disabled={isDisabled}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            todos={visibleTodos}
            handleDeleteTodo={handleDeleteTodo}
            setErrorMessage={setErrorMessage}
          />

          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              handleDeleteTodo={handleDeleteTodo}
              setErrorMessage={setErrorMessage}
              loadingByDefault
            />
          )}
        </section>

        {todos.length > 0 && (
          <Footer
            setFilter={setFilter}
            remainingTodos={remainingTodos}
            activeTodos={activeTodos}
            handleClearAll={handleClearAll}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />

      {/* Notification is shown in case of any error
      <div
        data-cy="ErrorNotification"
        className="notification is-danger is-light has-text-weight-normal"
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        Unable to load todos
        <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo
      </div> */}
    </div>
  );
};
