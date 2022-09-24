/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import classNames from 'classnames';
import {
  createTodo, getTodos, deleteTodo, updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { Error } from './components/Error';

enum FilterType {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<string>(FilterType.ALL);
  const [changeAllTodos, setChangeAllTodos] = useState(true);
  const [errorType, setError] = useState('');

  const fireTimeOut = () => {
    setTimeout(() => {
      setError('');
    }, 3000);
  };

  const fetchTodo = async () => {
    if (query.trim().length === 0) {
      setError('Title can\'t be empty');
      fireTimeOut();

      return;
    }

    try {
      const newTodo = await createTodo(user?.id, query);

      setTodos((prevState) => {
        return [...prevState, newTodo];
      });
    } catch (error) {
      setError('Unable to add a todo');
      fireTimeOut();
    }
  };

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter((x) => x.id !== todoId));
    } catch (error) {
      setError('Unable to delete a todo');
      fireTimeOut();
    }
  }, []);

  const changeTodo = useCallback(async (todoId: number, object: any) => {
    try {
      const updetedTodo: Todo = await updateTodo(todoId, object);

      setTodos(prev => (prev.map((x) => (x.id === todoId
        ? updetedTodo
        : x))
      ));
    } catch (error) {
      setError('Unable to update a todo');
      fireTimeOut();
    }
  }, []);

  const fireChangeAllTodos = () => {
    todos.forEach(todo => {
      changeTodo(todo.id, { completed: changeAllTodos });
    });

    setChangeAllTodos(!changeAllTodos);
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    getTodos(user?.id)
      .then(res => setTodos(res))
      .catch(() => errorType);

    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case FilterType.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case FilterType.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return [...todos];
    }
  }, [todos, filter]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={classNames(
                'todoapp__toggle-all',
                {
                  'todoapp__toggle-all active':
                  todos.every(todo => todo.completed),
                },
              )}
              onClick={fireChangeAllTodos}
            />
          )}

          <form onSubmit={(event) => {
            event.preventDefault();
            fetchTodo();
            setQuery('');
          }}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
              }}
            />
          </form>
        </header>

        <TodoList
          todos={filteredTodos}
          removeTodo={removeTodo}
          changeTodo={changeTodo}
        />

        {todos.length > 0
        && (
          <Footer
            setFilter={setFilter}
            filter={filter}
            todos={todos}
            removeTodo={removeTodo}
          />
        )}

      </div>

      {errorType && (
        <Error error={errorType} setError={setError} />
      )}
    </div>
  );
};
