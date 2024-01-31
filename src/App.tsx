/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState, useEffect, useRef,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { client } from './utils/fetchClient';
import { Todo } from './types/Todo';
import { ErrorType } from './types/ErrorType';
import { TypeOfFiltering } from './types/TypeOfFiltering';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';

const USER_ID = 9940;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterType, setFilterType] = useState<TypeOfFiltering>(
    TypeOfFiltering.All,
  );
  const [dataError, setError] = useState<string>('');
  const [activeLoader, setActiveLoader] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);

  const getTodos = () => {
    return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
  };

  const deleteTodo = (todoId: number) => {
    return client.delete(`/todos/${todoId}`);
  };

  const createTodo = ({
    id, userId, title, completed,
  }: Todo) => {
    return client.post<Todo>('/todos', {
      id, userId, title, completed,
    });
  };

  let timeoutId: ReturnType<typeof setTimeout>;

  const addTodo = async () => {
    try {
      if (inputValue.trim().length === 0) {
        throw new Error();
      }

      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: inputValue,
        completed: false,
      });

      const maxId = Math.max(...todos.map(todo => +todo.id));
      const newId = maxId + 1;

      const newTodo = await createTodo({
        id: +newId,
        userId: USER_ID,
        title: inputValue,
        completed: false,
      });

      setTodos(currrentTodos => {
        return ([...currrentTodos, newTodo]);
      });

      setTempTodo(null);
      setInputValue('');
    } catch (error) {
      setError(ErrorType.Add);
      timeoutId = setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  const deleteData = async (todoId: number) => {
    setActiveLoader(prev => {
      return [...prev, todoId];
    });
    try {
      await deleteTodo(todoId);

      setTodos((prev) => {
        return [...prev].filter(todo => todo.id !== todoId);
      });
    } catch {
      setError(ErrorType.Delete);
      timeoutId = setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setActiveLoader([]);
    }
  };

  const fetchData = async () => {
    try {
      const todosFromServer = await getTodos();

      setTodos(todosFromServer);
    } catch (error) {
      setError(ErrorType.Load);
      timeoutId = setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  useEffect(() => {
    fetchData();

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos]);

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
            className="todoapp__toggle-all active"
          />

          <form
            onSubmit={(event) => {
              event.preventDefault();

              return addTodo();
            }}
          >
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputValue}
              ref={inputRef}
              onChange={(event) => {
                setInputValue(event.target.value);
              }}
              disabled={!!tempTodo}
            />
          </form>
        </header>

        {todos && (
          <TodoList
            todos={todos}
            tempTodo={tempTodo}
            filterType={filterType}
            onDelete={(id: number) => deleteData(id)}
            activeLoader={activeLoader}
          />
        )}

        {(todos.length !== 0) && (
          <Footer
            todos={todos}
            setFilterType={setFilterType}
            filterType={filterType}
            onDelete={(id: number) => deleteData(id)}
          />
        )}
      </div>

      {!!dataError.length && (
        <div className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !dataError },
        )}
        >
          <button
            type="button"
            className="delete"
            onClick={() => setError('')}
          />
          {dataError}
        </div>
      )}
    </div>
  );
};
