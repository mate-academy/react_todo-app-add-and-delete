/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Main } from './Components/Main';
import { Header } from './Components/Header';
import { Footer } from './Components/Footer';
import { createTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { getFiltredTodos } from './utils/helpers';
import { FilterBy } from './types/FilterBy';
import { Notification } from './Components/Notification';

const USER_ID = 10904;

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filterBy, setFilterBy] = useState(FilterBy.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState([0]);

  useEffect(() => {
    getTodos(USER_ID)
      .then((todosFromServer: Todo[]) => {
        setTodos(todosFromServer);
      })
      .catch(() => setError('Unable to load toDos from server'));
  }, []);

  const addTodo = useCallback(async (title: string) => {
    try {
      const newTodo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo({
        id: 0,
        ...newTodo,
      });

      const createdTodo = await createTodo(newTodo);

      setTodos(currentTodos => [...currentTodos, createdTodo]);
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  }, []);

  const removeTodo = useCallback(async (id: number) => {
    try {
      setLoadingTodos(prevTodoId => [...prevTodoId, id]);
      await deleteTodo(id);

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setTempTodo(null);
      setLoadingTodos([0]);
    }
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = useMemo(() => (
    getFiltredTodos(todos, filterBy)
  ), [todos, filterBy]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setError={setError}
          addTodo={addTodo}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <Main
            todos={visibleTodos}
            loadingTodos={loadingTodos}
            removeTodo={removeTodo}
            tempTodo={tempTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            removeTodo={removeTodo}
          />
        )}
        <Notification error={error} setError={setError} />
      </div>
    </div>
  );
};
