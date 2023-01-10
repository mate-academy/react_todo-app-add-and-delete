/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';

import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Error } from './components/Error/Error';

import { Todo } from './types/Todo';
import { TypeError } from './types/TypeError';
import { FilterType } from './types/FilterType';
import { NewTodoField } from './components/NewTodoField/NewTodoField';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { User } from './types/User';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const [hasError, setHasError] = useState(false);
  const [errorType, setErrorType] = useState<TypeError>(TypeError.NONE);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  async function LoadTodos(utilizer: User) {
    try {
      const reponse = await getTodos(utilizer.id);

      setTodos(reponse);
    } catch {
      setHasError(true);
    }
  }

  useEffect(() => {
    if (user) {
      LoadTodos(user);
    }
  }, []);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const activeTodosLength = todos.filter(todo => !todo.completed).length;

  const completedTodos = todos.filter(todo => todo.completed);

  const onInputChange = (str: string) => {
    setQuery(str);
  };

  const onFormSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setHasError(false);

      if (query.trim() && user) {
        setIsLoading(true);

        try {
          const newTodo = {
            id: 0,
            userId: user.id,
            title: query.trim(),
            completed: false,
          };

          setQuery('');

          const { id, ...rest } = newTodo;

          setTempTodo(newTodo);

          const todoFromServer = await addTodo(rest);

          setTempTodo(null);

          setTodos((prevTodos) => [...prevTodos, todoFromServer]);
        } catch {
          setHasError(true);
          setErrorType(TypeError.ADD);
        } finally {
          setIsLoading(false);
        }
      } else {
        setHasError(true);
        setErrorType(TypeError.TITLE);
      }
    }, [query, user],
  );

  const onDeleteTodo = async (id: number) => {
    setLoadingTodoIds([id]);

    try {
      await deleteTodo(id);

      setTodos(todos.filter(todo => todo.id !== id));
    } catch {
      setHasError(true);
      setErrorType(TypeError.DELETE);
    } finally {
      setLoadingTodoIds([]);
    }
  };

  const onDeleteCompletedTodos = async () => {
    try {
      setLoadingTodoIds(prevIds => [
        ...prevIds,
        ...completedTodos.map(todo => todo.id),
      ]);

      const activeTodos = todos.filter(todo => !todo.completed);

      await Promise.all(completedTodos.map(todo => (
        deleteTodo(todo.id)
      )));

      setTodos(activeTodos);
    } catch {
      setHasError(true);
      setErrorType(TypeError.REMOVE);
    }

    setLoadingTodoIds([]);
  };

  const removeErrorHandler = () => {
    setHasError(false);
    setErrorType(TypeError.NONE);
  };

  if (hasError) {
    setTimeout(() => setHasError(false), 3000);
  }

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterType) {
        case FilterType.Active:
          return todo.completed === false;

        case FilterType.Completed:
          return todo.completed === true;

        default:
          return todo;
      }
    });
  }, [filterType, todos]);

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

          <NewTodoField
            newTodoField={newTodoField}
            query={query}
            onInputChange={onInputChange}
            onFormSubmit={onFormSubmit}
            isAdding={isLoading}
          />
        </header>

        {todos && (
          <>
            <TodoList
              todos={visibleTodos}
              onDeleteTodo={onDeleteTodo}
              loadingTodoIds={loadingTodoIds}
              tempTodo={tempTodo}
            />

            <Footer
              onDeleteCompletedTodos={onDeleteCompletedTodos}
              todosLeft={activeTodosLength}
              setFilterType={setFilterType}
              filterType={filterType}
              completedTodosLength={completedTodos.length}
            />
          </>
        )}
      </div>

      {hasError && (
        <Error
          errorType={errorType}
          onRemoveErrorHandler={removeErrorHandler}
        />
      )}
    </div>
  );
};
