/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';

import {
  getTodos,
  createTodo,
  deleteTodos,
} from './api/todos';

import { SortType } from './types/SortType';
import { Todo } from './types/Todo';
import { ErrorType } from './types/ErrorType';

import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortType, setSortType] = useState<SortType>(SortType.ALL);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [selectedId, setSelectedId] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const filteredTodo = useMemo(() => todos.filter(todo => {
    switch (sortType) {
      case SortType.ACTIVE:
        return !todo.completed;
      case SortType.COMPLETED:
        return todo.completed;
      default:
        return todo;
    }
  }), [todos]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    const getTodosFromServer = async (userId: number) => {
      try {
        const receivedTodos = await getTodos(userId);

        setTodos(receivedTodos);
      } catch (errorMessage) {
        setError(`${errorMessage}`);
      }
    };

    getTodosFromServer(user.id);
  }, []);

  const getValue = (element: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(element.target.value);
  };

  const addNewTodo = useCallback(async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim() || !user) {
      setError(ErrorType.ErrorTitle);

      return;
    }

    setIsAdding(true);

    try {
      const newTodo = await createTodo(title, user.id);

      setTodos((prevTodos) => [...prevTodos, newTodo]);
    } catch {
      setError(ErrorType.NotAdd);
    }

    setIsAdding(false);
    setTitle('');
  }, [title, user]);

  const removeTodo = useCallback(async (TodoId: number) => {
    setSelectedId([TodoId]);

    try {
      await deleteTodos(TodoId);

      setTodos((prevTodos) => prevTodos.filter(({ id }) => id !== TodoId));
    } catch {
      setError(ErrorType.NotDelete);
    }
  }, [todos, error]);

  const completedTodos = todos.filter(({ completed }) => completed);

  const clearCompletedTodos = useCallback(
    async () => {
      try {
        setSelectedId([...completedTodos].map(({ id }) => id));

        await Promise.all(completedTodos.map(({ id }) => removeTodo(id)));
        await (() => setTodos((prevTodos) => prevTodos
          .filter(({ completed }) => !completed)));
      } catch {
        setError(ErrorType.NotDelete);
        setSelectedId([]);
      }
    }, [todos, selectedId, error],
  );

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
          <form onSubmit={addNewTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={getValue}
            />
          </form>
        </header>

        {Boolean(todos.length) && (
          <>
            <TodoList
              filteredTodo={filteredTodo}
              removeTodo={removeTodo}
              selectedId={selectedId}
              isAdding={isAdding}
              title={title}
            />

            <Footer
              todos={todos}
              sortType={sortType}
              setSortType={setSortType}
              clearCompletedTodos={clearCompletedTodos}
            />
          </>
        )}
      </div>

      {error && (
        <ErrorMessage
          error={error}
          setError={setError}
        />
      )}
    </div>
  );
};
