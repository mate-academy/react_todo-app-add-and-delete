/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import React, {
  useState, useEffect, useMemo, useRef,
} from 'react';
import { UserWarning } from './UserWarning';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';

import { getTodos, postTodos } from './api/todos';
import { ShowState } from './types/ShowState';
import { ErrorTypes } from './types/ErrorTypes';
import { Error } from './components/Error';
import { Loader } from './components/Loader';

const USER_ID = 12177;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | []>([]);
  const [showState, setShowState] = useState<ShowState>(ShowState.All);
  const [error, setError] = useState<ErrorTypes | null>(null);
  const [loading, setLoading] = useState(false);
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoId, setNewTodoId] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const filteredTodos = useMemo(() => {
    switch (showState) {
      case ShowState.All:
        return todos;
      case ShowState.Active:
        return todos.filter(toddo => !toddo.completed);
      case ShowState.Completed:
        return todos.filter(toddo => toddo.completed);
      default:
        return todos;
    }
  }, [showState, todos]);

  const loadAllTodos = async () => {
    setLoading(true);
    try {
      const allTodos = await getTodos(USER_ID);

      return allTodos;
    } catch (err) {
      setError(ErrorTypes.LOAD_ALL_TODOS);
      setTimeout(() => {
        setError(null);
      }, 3000);

      return undefined;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setError(null);

    (async () => {
      const todosData = await loadAllTodos();

      if (todosData) {
        setTodos(todosData);
      }
    })();

    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (todoTitle.trim()) {
      const newTodo = {
        id: 0,
        userId: USER_ID,
        title: todoTitle,
        completed: false,
      };

      if (inputRef.current) {
        inputRef.current.disabled = true;
      }

      try {
        await postTodos(newTodo);
        setTempTodo(newTodo);
        setTodos(prevTodos => [...prevTodos, { ...newTodo, id: newTodoId }]);
        setNewTodoId(prevId => prevId + 1);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
        setTempTodo(null);
      } catch (err) {
        setError(ErrorTypes.ADD_TODO);
        setTimeout(() => {
          setError(null);
        }, 3000);
      }

      if (inputRef.current) {
        inputRef.current.disabled = false;
      }

      setTodoTitle('');
    } else {
      setError(ErrorTypes.TITLE);
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const handleTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(e.target.value);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: todos.every(toddd => toddd.completed),
            })}
            data-cy="ToggleAllButton"
          />
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={inputRef}
              onChange={handleTodo}
              value={todoTitle}
            />
          </form>
        </header>

        {filteredTodos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            setTodos={setTodos}
            tempTodo={tempTodo}
            setError={setError}
          />
        )}
        {loading && <Loader />}
        {todos.length > 0 && (
          <Footer
            todos={filteredTodos}
            setTodos={setTodos}
            showState={showState}
            setShowState={setShowState}
            setError={setError}
          />
        )}
        {error && <Error error={error} setError={setError} />}
      </div>
    </div>
  );
};
