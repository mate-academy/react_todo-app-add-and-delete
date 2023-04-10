/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { Hearts } from 'react-loader-spinner';
import {
  getTodos,
  addTodo,
  deleteTodo,
} from './api/todos';

import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer';

import { getActiveTodos, getFilteredTodos } from './helpers/helpers';
import { FilterType } from './types/FilterType';
import { ErrorType } from './types/ErrorType';
import { ErrorMessage } from './components/ErrorMessage';

const USER_ID = 6928;

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorType>(ErrorType.NONE);
  const [filterType, setFilterType] = useState(FilterType.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [disableField, setDisableField] = useState(false);
  const [loadingTodosId, setLoadingTodosId] = useState([0]);

  const showError = (errorName: ErrorType) => {
    setErrorMessage(errorName);
    setHasError(true);

    setTimeout(() => {
      setHasError(false);
    }, 3000);
  };

  const handleClosingError = () => {
    setHasError(false);
  };

  const visibleTodos = useMemo(() => {
    return getFilteredTodos(todos, filterType);
  }, [todos, filterType]);

  const activeTodos = useMemo(() => {
    return getActiveTodos(visibleTodos);
  }, [visibleTodos]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        const todosFromServer = await getTodos(USER_ID);

        setTodos(todosFromServer);
      } catch {
        showError(ErrorType.LOAD);
      }

      setIsLoading(false);
    };

    loadData();
  }, []);

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
      setTempTodo({
        ...newTodo,
        id: 0,
      });
      setDisableField(true);

      const currNewTodo = await addTodo(USER_ID, newTodo);

      setTodos(prevTodos => [...prevTodos, currNewTodo]);
    } catch {
      showError(ErrorType.ADD);
    }

    setTempTodo(null);
    setDisableField(false);
  };

  const removeTodo = async (todoId: number) => {
    try {
      setLoadingTodosId(prevIds => [...prevIds, todoId]);

      await deleteTodo(todoId);

      setTodos(prevTodos => (
        prevTodos.filter(({ id }) => id !== todoId)
      ));
    } catch {
      showError(ErrorType.DELETE);
    }

    setLoadingTodosId([0]);
    setHasError(false);
  };

  const handleDeleteCompleted = useCallback(() => {
    todos.forEach(({ completed, id }) => {
      if (completed) {
        deleteTodo(id);
      }
    });
  }, [visibleTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAdd={addNewTodo}
          disabled={disableField}
          activeTodos={activeTodos}
        />

        {isLoading && (
          <Hearts
            height="80"
            width="80"
            color="#f3e0e0"
            ariaLabel="hearts-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible
          />
        )}

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          onDelete={removeTodo}
          loadingTodosId={loadingTodosId}
        />

        {todos.length > 0 && (
          <Footer
            filterType={filterType}
            onFilterChange={setFilterType}
            activeTodos={activeTodos}
            onDeleteCompleted={handleDeleteCompleted}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        hasError={hasError}
        onClose={handleClosingError}
      />
    </div>
  );
};
