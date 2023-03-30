import {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getFilteredTodos } from './helpers/helpers';
import { addTodo, getTodos, removeTodo } from './api/todos';

import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Todo } from './components/TodoItem/Todo';
import { ErrorModal } from './components/ErrorModal/ErrorModal';
import { LoadContext } from './LoadContext';
import { FilterType } from './types/FilterType';
import { ErrorType } from './types/ErrorType';

import { UserWarning } from './UserWarning';

const USER_ID = 6748;

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL);
  const [error, setError] = useState<ErrorType>(ErrorType.NONE);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [unableField, setUnableField] = useState(false);
  const [loadingTodos, setLoadingTodos] = useState([0]);

  const showError = (errorType: ErrorType) => {
    setError(errorType);
    setTimeout(() => setError(ErrorType.NONE), 3000);
  };

  const handleCloseError = useCallback(() => {
    setError(ErrorType.NONE);
  }, []);

  const activeTodos = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const fetchTodos = async () => {
    try {
      const response = await getTodos(USER_ID);

      setTodos(response);
    } catch {
      showError(ErrorType.LOAD);
      setTodos([]);
    }
  };

  const addNewTodo = async (title: string) => {
    if (!title.trim()) {
      showError(ErrorType.TITLE);

      return;
    }

    const newTodo = {
      title,
      userId: USER_ID,
      completed: false,
    };

    try {
      setUnableField(true);
      setTempTodo({
        id: 0,
        ...newTodo,
      });

      const todo = await addTodo(USER_ID, newTodo);

      setTodos(prevTodos => [...prevTodos, todo]);
    } catch {
      showError(ErrorType.ADD);
    } finally {
      setUnableField(false);
      setTempTodo(null);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      setLoadingTodos(prevTodos => [...prevTodos, id]);

      await removeTodo(id);
      setTodos(prevTodos => (
        prevTodos.filter(todo => todo.id !== id)
      ));
    } catch {
      showError(ErrorType.DELETE);
    } finally {
      setLoadingTodos([0]);
      setError(ErrorType.NONE);
    }
  };

  const handleDeleteCompleted = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });
  }, [todos]);

  const visibleTodos = useMemo(
    () => getFilteredTodos(todos, filterType),
    [filterType, todos],
  );

  useEffect(() => {
    fetchTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <LoadContext.Provider value={loadingTodos}>
      <div className="todoapp">
        <h1 className="todoapp__title">
          todos
        </h1>

        <div className="todoapp__content">
          <Header
            onAdd={addNewTodo}
            disabled={unableField}
            activeTodos={activeTodos}
          />

          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            onDelete={deleteTodo}
          />

          {todos.length > 0 && (
            <Footer
              todos={todos}
              filterType={filterType}
              onChangeFilterType={setFilterType}
              onRemoveCompleted={handleDeleteCompleted}
              activeTodos={activeTodos}
            />
          )}
        </div>

        {error && (
          <ErrorModal
            error={error}
            onClose={handleCloseError}
          />
        )}
      </div>
    </LoadContext.Provider>
  );
};
