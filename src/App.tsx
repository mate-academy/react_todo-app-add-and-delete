/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { User } from './types/User';
import { getTodos, addTodos, deleteTodos } from './api/todos';
import { NewTodoField } from './components/NewTodoField/NewTodoField';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { FilterType } from './types/Filtertype';
import { ErrorType } from './types/ErrorType';
import { Error } from './components/Error/Error';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState(FilterType.all);
  const [activeTodoLength, setActiveTodosLength] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorType, setErrorType] = useState(ErrorType.none);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isIncludeId, setIsIncludId] = useState<number[]>([]);
  const [activeTodos, setActiveTodos] = useState<Todo[]>([]);
  const [complitedTodos, setComplitedTodos] = useState<Todo[]>([]);

  async function loadTodos(userData: User) {
    try {
      const result = await getTodos(userData.id);

      setTodos(result);
    } catch {
      setHasError(true);
    }
  }

  useEffect(() => {
    if (user) {
      loadTodos(user);
    }
  }, []);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    setActiveTodosLength(todos.filter(todo => todo.completed !== true).length);
    setActiveTodos(todos.filter(todo => !todo.completed));
    setComplitedTodos(todos.filter(todo => todo.completed));
  }, [todos]);

  useEffect(() => {
    setTimeout(() => {
      setHasError(false);
    }, 3000);
  }, [hasError]);

  const onInputChange = (str: string) => {
    setQuery(str);
  };

  const onFormSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (query.trim()) {
        setIsAdding(true);

        const newTodo: Todo = {
          id: 0,
          userId: user?.id || +new Date(),
          title: query.trim(),
          completed: false,
        };

        try {
          const { id, ...toServer } = newTodo;

          setTempTodo(newTodo);

          const todoFromServer = await addTodos(toServer);
          const itemTodo: Todo = todoFromServer as Todo;

          setIsAdding(false);
          setTodos((prevTodos) => [...prevTodos, itemTodo]);

          setQuery('');
        } catch {
          setErrorType(ErrorType.add);
          setHasError(true);
        } finally {
          setTempTodo(null);
        }
      } else {
        setErrorType(ErrorType.empty);
        setHasError(true);
      }
    }, [query, user],
  );

  const clearCompleted = async () => {
    try {
      setIsIncludId(prevIncludId => [
        ...prevIncludId, ...complitedTodos.map(todo => todo.id)]);
      await Promise.all(complitedTodos.map(todo => (
        deleteTodos(todo.id)
      )));

      setTodos(activeTodos);
    } catch {
      setHasError(true);
      setErrorType(ErrorType.delete);
    }
  };

  const onRemoveTodo = async (id: number) => {
    setIsIncludId([id]);

    try {
      await deleteTodos(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch {
      setHasError(true);
      setErrorType(ErrorType.delete);
    } finally {
      setIsIncludId([]);
    }
  };

  const visibleTodos = () => {
    return todos.filter(todo => {
      switch (filterType) {
        case FilterType.completed:
          return todo.completed === true;
        case FilterType.active:
          return todo.completed === false;
        default:
          return todo;
      }
    });
  };

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
            query={query}
            newTodoField={newTodoField}
            onFormSubmit={onFormSubmit}
            onInputChange={onInputChange}
            isAdding={isAdding}
          />
        </header>

        { todos.length > 0 && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              <TodoList
                todos={visibleTodos()}
                tempTodo={tempTodo}
                isIncludeId={isIncludeId}
                onDeleteItem={onRemoveTodo}
              />
            </section>

            <Footer
              todoItemLeft={activeTodoLength}
              filterType={filterType}
              setFilterType={setFilterType}
              clearCompleted={clearCompleted}
              complitedTodos={complitedTodos}
            />
          </>
        )}
      </div>

      <Error
        errorType={errorType}
        hasError={hasError}
        setHasError={setHasError}
      />

    </div>
  );
};
