import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { FilterBy } from './types/FilterBy';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activeTodosQuantity, setActiveTodosQuantity] = useState(0);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.ALL);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>(todos);
  const [isError, setIsError] = useState(false);

  const getTodosFromServer = useCallback(async () => {
    if (user) {
      try {
        const todosFromServer = await getTodos(user.id);
        const activeTodosNumber = todosFromServer
          .filter(({ completed }) => !completed).length;

        setTodos(todosFromServer);
        setActiveTodosQuantity(activeTodosNumber);
      } catch {
        setIsError(true);
      }
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsError(false);
    }, 3000);
  }, [isError]);

  useEffect(() => {
    setVisibleTodos(todos.filter(todo => {
      switch (filterBy) {
        case FilterBy.ACTIVE:
          return !todo.completed;

        case FilterBy.COMPLETED:
          return todo.completed;

        default:
          return todo;
      }
    }));
  }, [todos, filterBy]);

  useEffect(() => {
    getTodosFromServer();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <TodoList visibleTodos={visibleTodos} />

        <Footer
          activeTodosQuantity={activeTodosQuantity}
          filterBy={filterBy}
          setFilterBy={setFilterBy}
        />
      </div>

      {isError && (
        <ErrorNotification isError={isError} setIsError={setIsError} />
      )}
    </div>
  );
};
