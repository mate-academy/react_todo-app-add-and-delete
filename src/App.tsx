import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { addTodo, getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';

import { TodoList } from './components/TodoList/TodoList';
import { TempTodo } from './components/TempTodo/TempTodo';
import { Footer } from './components/Footer/Footer';
import { ErrorNotify } from './components/ErrorNotification/ErrorNotification';

import { ErrorMessage } from './types/ErrorMessage';
import { ErrorData } from './types/ErrorData';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState<ErrorData>({
    status: false,
    notification: ErrorMessage.None,
  });
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');

  const handleError = useCallback((notification: ErrorMessage) => {
    setIsError({
      status: true,
      notification,
    });

    setTimeout(() => setIsError({
      status: false,
      notification: ErrorMessage.None,
    }), 3000);
  }, []);

  const loadTodos = async () => {
    if (user) {
      try {
        const todosFromServer = await getTodos(user.id);

        setTodos(() => todosFromServer);
        setVisibleTodos(() => todosFromServer);
      } catch {
        handleError(ErrorMessage.Load);
      }
    }
  };

  const additingTodo = async () => {
    try {
      let newTodo: Todo;

      if (user) {
        newTodo = await addTodo(user.id, title);
      }

      setTodos((prevTodos: Todo[]): Todo[] => [
        ...prevTodos,
        newTodo,
      ]);
    } catch {
      setIsError({
        status: true,
        notification: ErrorMessage.Add,
      });
    } finally {
      setIsAdding(false);
      setTitle('');
    }
  };

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      handleError(ErrorMessage.Empty);
      // throw new Error(ErrorMessage.Empty);
    }

    setIsAdding(true);

    additingTodo();
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [todos]);

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            aria-label="button"
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
          />

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={isAdding}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <TodoList todos={visibleTodos} />

            {isAdding && <TempTodo title={title} />}

            <Footer
              todos={todos}
              setVisibleTodos={(visTodos: Todo[]) => setVisibleTodos(visTodos)}
              todosCount={visibleTodos.length}
            />
          </>
        )}
      </div>

      <ErrorNotify
        isError={isError}
        onResetError={() => setIsError({
          status: false,
          notification: ErrorMessage.None,
        })}
      />
    </div>
  );
};
