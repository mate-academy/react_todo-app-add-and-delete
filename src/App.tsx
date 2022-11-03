import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { addTodo, deleteTodo, getTodos } from './api/todos';
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
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deletedTodoIds, setDeletedTodoId] = useState<number[]>([]);

  const completedTodosId = useMemo((
    () => todos.filter(todo => todo.completed)
      .map(todo => todo.id)
  ), [todos]);

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

      setTodos((prevTodos) => [
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

  const removingTodos
    = async (todoId: number | number[] = completedTodosId) => {
      const todosForRemoving = !Array.isArray(todoId)
        ? [todoId]
        : [...todoId];

      setDeletedTodoId(todosForRemoving);

      try {
        await Promise.all(todosForRemoving.map(id => deleteTodo(id)));

        setTodos((prevTodos) => prevTodos.filter(
          todo => !todosForRemoving.includes(todo.id),
        ));
      } catch {
        handleError(ErrorMessage.Remove);
      } finally {
        setDeletedTodoId([]);
      }
    };

  const handleSubmit = useCallback((event: React.SyntheticEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      handleError(ErrorMessage.Empty);
      throw new Error(ErrorMessage.Empty);
    }

    setIsAdding(true);

    additingTodo();
  }, [title]);

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
            <TodoList
              todos={visibleTodos}
              onRemove={(todoId: number) => removingTodos(todoId)}
              deletedTodoId={deletedTodoIds}
            />

            {isAdding && <TempTodo title={title} />}

            <Footer
              todos={todos}
              setVisibleTodos={(visTodos: Todo[]) => setVisibleTodos(visTodos)}
              todosCount={visibleTodos.length}
              onRemove={() => removingTodos()}
              complitedTodos={completedTodosId}
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
