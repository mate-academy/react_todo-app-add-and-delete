//* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  FormEvent,
} from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, addTodo, removeTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { Filter, ErrorType } from './utils/enums';
import { TodoList } from './components/TodoList';
import { TodoItem } from './components/TodoItem';

const USER_ID = 10380;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorType | null>(null);
  const [filterStatus, setFilterStatus] = useState<Filter>(Filter.All);
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deletedTodos, setDeletedTodos] = useState<number[]>([]);

  function filterTodos() {
    switch (filterStatus) {
      case Filter.All:
        return todos;
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      default:
        return todos;
    }
  }

  const visibleTodos = useMemo(filterTodos, [todos, filterStatus]);
  const activeTodos = todos?.filter(todo => !todo.completed);
  const isCompletedTodos = todos.some(todo => todo.completed);
  const allCompletedTodosId = todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  const getDataFromServer = useCallback(() => {
    getTodos(USER_ID)
      .then(data => setTodos(data))
      // eslint-disable-next-line no-console
      .catch(() => setError(ErrorType.Get));
  }, []);

  const addDataToServer = (title: string) => {
    setIsLoading(true);
    addTodo(USER_ID, title)
      .then(data => {
        setIsLoading(false);
        setTodos([...todos, data]);
        setTempTodo(null);
      })
      .catch(() => setError(ErrorType.Post));
  };

  const removeDataFromServer = (todoId: number) => {
    removeTodo(todoId)
      .then(() => {
        setTodos(currTodos => currTodos.filter(todo => todo.id !== todoId));
        setDeletedTodos(currState => currState.filter(id => id !== todoId));
      })
      .catch(() => setError(ErrorType.Delete));
  };

  const handleFilter = (status: Filter) => {
    setFilterStatus(status);
  };

  const handleError = (type: ErrorType | null) => {
    setError(type);
  };

  const handleInput = (value: string) => {
    setQuery(value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query) {
      setError(ErrorType.isEmpty);

      return;
    }

    setError(null);
    addDataToServer(query);
    setQuery('');
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: query,
      completed: false,
    });
  };

  const handleRemove = (todoId: number[]) => {
    setDeletedTodos(currState => [...currState, ...todoId]);
    todoId.forEach(id => {
      removeDataFromServer(id);
    });
  };

  useEffect(() => {
    getDataFromServer();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          query={query}
          onChange={handleInput}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

        {todos && (
          <>
            <section className="todoapp__main">
              {visibleTodos && (
                <TodoList
                  todos={visibleTodos}
                  onClose={handleRemove}
                  deletedTodos={deletedTodos}
                />
              )}
              {tempTodo && (
                <TodoItem
                  todo={tempTodo}
                  onClose={handleRemove}
                  deletedTodos={deletedTodos}
                />
              )}
            </section>

            <Footer
              filterStatus={filterStatus}
              onFilterChange={handleFilter}
              numberOfTodos={activeTodos?.length}
              isCompletedTodos={isCompletedTodos}
              onRemove={handleRemove}
              allCompletedTodosId={allCompletedTodosId}
            />
          </>
        )}
      </div>

      <ErrorNotification error={error} onError={handleError} />
    </div>
  );
};
