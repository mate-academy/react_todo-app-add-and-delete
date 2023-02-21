import React, {
  useState, useEffect, useMemo, useCallback, useContext,
} from 'react';
// import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { FilterByStatus } from './types/FilterByStatus';
import { PossibleError } from './types/PossibleError';
import { getTodos, removeTodo } from './api/todos';
import { UserIdContext } from './utils/context';

// const USER_ID = 6383;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredByStatus, setFilteredByStatus] = useState(FilterByStatus.All);
  const [possibleError, setPossibleError] = useState(PossibleError.None);
  const [isError, setIsError] = useState(false);
  const [tempTodo, setTempTodo] = useState('');
  const [isClearCompleted, setIsClearCompleted] = useState(false);

  const userId = useContext(UserIdContext);

  useEffect(() => {
    const getTodosFromServer = async () => {
      try {
        const todosFromServer = await getTodos(userId);

        setTodos(todosFromServer);
      } catch (error) {
        setIsError(true);
        setPossibleError(PossibleError.Download);
      }
    };

    getTodosFromServer();
  }, []);

  const completedTodosLength = todos.filter(todo => todo.completed).length;
  const activeTodosLength = todos.filter(todo => !todo.completed).length;

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      switch (filteredByStatus) {
        case FilterByStatus.All:
          return true;

        case FilterByStatus.Active:
          return !todo.completed;

        case FilterByStatus.Completed:
          return todo.completed;

        default:
          return true;
      }
    });
  }, [todos, filteredByStatus]);

  const addNewTodo = useCallback(
    (newTodo: Todo): void => setTodos((prevTodos) => [...prevTodos, newTodo]),
    [],
  );

  const deleteTodo = useCallback(
    (todoId: number): void => (
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId))
    ),
    [],
  );

  const showError = useCallback((error: PossibleError) => {
    setPossibleError(error);
    setIsError(true);
  }, []);

  const hideError = useCallback(() => {
    setIsError(false);
  }, []);

  const onClearCompleted = useCallback(() => {
    const finishedTodos = todos.filter(todo => todo.completed);

    setIsClearCompleted(true);
    hideError();

    Promise.all(
      finishedTodos.map((todo) => removeTodo(todo.id)
        .then(() => todo.id)),
    )
      .then((todoIds) => {
        setTodos((prevTodos) => {
          return prevTodos.filter(todo => !todoIds.includes(todo.id));
        });
      })
      .catch(() => {
        showError(PossibleError.Delete);
      })
      .finally(() => {
        setIsClearCompleted(false);
      });
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          activeTodosLength={activeTodosLength}
          showTempTodo={setTempTodo}
          createNewTodo={addNewTodo}
          showError={showError}
          hideError={hideError}
        />

        <TodoList
          todos={filteredTodos}
          tempTodoTitle={tempTodo}
          deleteTodo={deleteTodo}
          isClearCompleted={isClearCompleted}
          showError={showError}
          hideError={hideError}
        />

        {todos.length > 0 && (
          <Footer
            activeTodosLength={activeTodosLength}
            completedTodosLength={completedTodosLength}
            filteredByStatus={filteredByStatus}
            setFilteredByStatus={setFilteredByStatus}
            onClearCompleted={onClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        possibleError={possibleError}
        isError={isError}
        onErrorNotificationClose={hideError}
      />
    </div>
  );
};
