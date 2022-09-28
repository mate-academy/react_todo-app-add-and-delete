/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cN from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';

import { TodoList } from './components/Todo/TodoList';
import { ErrorNotification } from './components/Todo/ErrorNotification';

import { Todo } from './types/Todo';
import { TodoFilter } from './types/TodoFilter';
import { Error } from './types/Errors';
import { Footer } from './components/Todo/Footer';
import {
  getTodos, createTodo, deleteTodo, updateTodo,
} from './api/todos';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState<string>(TodoFilter.All);
  const [allTodos, setAllTodos] = useState(true);
  const [query, setQuery] = useState('');

  const filteredList = todos.filter(todo => {
    switch (filter) {
      case TodoFilter.All:
        return todo;
      case TodoFilter.Active:
        return !todo.completed;
      case TodoFilter.Completed:
        return todo.completed;
      default:
        return todo;
    }
  });

  useEffect(() => {
    getTodos(user?.id)
      .then(() => setTodos)
      .catch(() => setError(Error.Loading));
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  if (error) {
    setTimeout(() => {
      setError(null);
    }, 3000);
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!query.trim()) {
      setError(Error.Title);

      return;
    }

    await createTodo(user?.id, query)
      .then(todo => {
        setTodos([...todos, todo]);
      })
      .catch(() => {
        setError(Error.Add);
      });

    setQuery('');
  };

  const removeTodo = useCallback(
    async (todoId: number) => {
      try {
        await deleteTodo(todoId);
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      } catch {
        setError(Error.Delete);
      }
    }, [],
  );

  const changeTodo = useCallback(async (todoId: number, object: unknown) => {
    try {
      const updatedTodo: Todo = await updateTodo(todoId, object);

      setTodos(prev => prev.map(todo => {
        if (todo.id === updatedTodo.id) {
          return updatedTodo;
        }

        return todo;
      }));
    } catch {
      setError(Error.Update);
    }
  }, []);

  const changeAllTodos = () => {
    todos.forEach(todo => {
      changeTodo(todo.id, { completed: allTodos });
    });

    setAllTodos(!allTodos);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0
          && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={cN(
                'todoapp__toggle-all',
                {
                  active:
                  todos.every(todo => todo.completed),
                },
              )}
              onClick={changeAllTodos}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            />
          </form>
        </header>
        <TodoList
          todos={filteredList}
          removeTodo={removeTodo}
          changeTodo={changeTodo}
        />
        {todos.length > 0
        && (
          <Footer
            todos={todos}
            setFilter={setFilter}
            filter={filter}
            removeTodo={removeTodo}
          />
        )}
      </div>
      {(error) && (
        <ErrorNotification
          error={error}
          setError={setError}
        />
      )}
    </div>
  );
};
