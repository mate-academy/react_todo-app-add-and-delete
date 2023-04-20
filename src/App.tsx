import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, addTodo, removeTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { TodoInput } from './components/TodoInput/TodoInput';
import { FilterType } from './types/FilterType';
import { Notification } from './components/Notification/Notification';
import { ErrorType } from './types/ErrorType';
import { Footer } from './components/Footer/Footer';

const USER_ID = 7022;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [isError, setIsError] = useState<ErrorType>(ErrorType.None);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodo, setLoadingTodo] = useState<number[]>([0]);

  const showError = (errorType : ErrorType) => {
    setIsError(errorType);
    setTimeout(() => setIsError(ErrorType.None), 3000);
  };

  const handleCloseError = useCallback(() => {
    setIsError(ErrorType.None);
  }, []);

  useEffect(() => {
    getTodos(USER_ID)
      .then(data => setTodos(data))
      .catch(() => {
        showError(ErrorType.Load);
      });
  }, []);

  const activeTodos = useMemo(
    () => todos.filter(todo => !todo.completed), [todos],
  );

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed), [todos],
  );

  const filteredTodos = useMemo(() => {
    switch (filterType) {
      case FilterType.Completed:
        return completedTodos;

      case FilterType.Active:
        return activeTodos;

      default:
        return todos;
    }
  }, [filterType, activeTodos, completedTodos, todos]);

  const handleChangeFilter = (filter: FilterType) => (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    event.preventDefault();
    setFilterType(filter);
  };

  const handleAddTodo = useCallback((title: string) => {
    if (!title.trim()) {
      showError(ErrorType.Title);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title,
      completed: false,
    };

    setIsLoading(true);
    setTempTodo({ id: 0, ...newTodo });

    addTodo(newTodo)
      .then((data) => {
        setTodos((prevTodos) => [...prevTodos, data]);
      })
      .catch(() => {
        showError(ErrorType.Add);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  }, []);

  const handleRemoveTodo = (todoId: number) => {
    setIsLoading(true);
    setLoadingTodo((prevTodo) => [...prevTodo, todoId]);

    removeTodo(todoId)
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        showError(ErrorType.Delete);
      })
      .finally(() => {
        setIsLoading(false);
        setLoadingTodo([0]);
      });
  };

  const handleClearCompleted = () => {
    setIsLoading(true);

    const completedTodoIds = completedTodos
      .filter(todo => todo.id !== undefined)
      .map(todo => todo.id ?? -1);

    Promise.all(
      completedTodoIds.map(todoId => handleRemoveTodo(todoId)),
    )
      .then(() => {
        setTodos(activeTodos);
      })
      .catch(() => {
        showError(ErrorType.Delete);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoInput
          isActiveButton={activeTodos.length > 0}
          onSubmit={handleAddTodo}
          isDisabled={isLoading}
        />

        <section className="todoapp__main">
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            onRemove={handleRemoveTodo}
            loadingTodo={loadingTodo}
          />
        </section>

        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodos.length}
            completedTodosCount={completedTodos.length}
            filterType={filterType}
            onChangeFilter={handleChangeFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {isError && (
        <Notification
          error={isError}
          onClose={handleCloseError}
        />
      )}
    </div>
  );
};
