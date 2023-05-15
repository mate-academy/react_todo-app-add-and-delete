import {
  useCallback,
  useEffect,
  useState,
  FC,
  useMemo,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Filter } from './types/FilterEnum';
import { addTodos, deleteTodos, getTodos } from './api/todos';
import { TodoList } from './components/TodoList';
import { TodoForm } from './components/TodoForm';
import { BottomPanel } from './components/BottomPanel';
import { ErrorMessage } from './components/ErrorMessage';
import { Error } from './types/ErrorEnum';

const USER_ID = 10268;

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterOfTodo, setFilterOfTodo] = useState(Filter.ALL);
  const [hasError, setHasError] = useState(false);
  const [idOfDeletedTodo, setIdOfDeletedTodo] = useState<number | null>(null);
  const [
    completedTodosID,
    setCompletedTodosID,
  ] = useState<number[] | null>(null);
  const [typeOfError, setTypeOfError] = useState<Error>(Error.NONE);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const changeFilterOfTodo = useCallback((status: Filter) => {
    setFilterOfTodo(status);
  }, []);

  const closeErrorMessage = useCallback(() => {
    setHasError(false);
  }, []);

  const createTodoOnServer = useCallback(async (data: Todo) => {
    try {
      const todo = await addTodos(data, USER_ID);

      setTodos(prevTodo => [...prevTodo, todo]);
    } catch {
      setHasError(true);
      setTypeOfError(Error.ADD);
    }

    setTempTodo(null);
  }, []);

  const deleteTodoFromServer = useCallback(async (id: number) => {
    try {
      const deletedTodo = await deleteTodos(id);

      if (deletedTodo) {
        setIdOfDeletedTodo(null);
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      }
    } catch {
      setHasError(true);
      setTypeOfError(Error.DELETE);
    }
  }, []);

  const addTodo = useCallback((query: string) => {
    if (!query.trim()) {
      setHasError(true);
      setTypeOfError(Error.EMPTY);

      return;
    }

    const data = {
      id: 0,
      userId: USER_ID,
      title: query,
      completed: false,
    };

    setTempTodo(data);
    createTodoOnServer(data);
  }, []);

  const deleteTodo = useCallback((id: number) => {
    setIdOfDeletedTodo(id);
    deleteTodoFromServer(id);
  }, []);

  const deleteAllCompleted = () => {
    const completedTodoIds = todos
      .filter(({ completed }) => completed)
      .map(({ id }) => id);

    setCompletedTodosID(completedTodoIds);

    completedTodoIds.forEach(id => {
      deleteTodoFromServer(id);
    });
  };

  const isCompletedTodos = () => {
    return todos.some(({ completed }) => completed);
  };

  const filterTodos = useCallback(() => {
    switch (filterOfTodo) {
      case Filter.ACTIVE:
        return todos.filter(({ completed }) => !completed);
      case Filter.COMPLETED:
        return todos.filter(({ completed }) => completed);
      default:
        return todos;
    }
  }, [todos, filterOfTodo]);

  useEffect(() => {
    const loadTodoFromServer = async () => {
      try {
        const todosFromServer = await getTodos(USER_ID);

        setTodos(todosFromServer);
      } catch {
        setHasError(true);
        setTypeOfError(Error.SERVER);
      }
    };

    loadTodoFromServer();
  }, []);

  useEffect(() => {
    let timeoutID: ReturnType<typeof setTimeout>;

    if (hasError) {
      timeoutID = setTimeout(() => {
        setHasError(false);
      }, 3000);
    }

    return () => {
      clearTimeout(timeoutID);
    };
  }, [hasError]);

  const visibleTodos = useMemo(() => filterTodos(), [todos, filterOfTodo]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm addTodo={addTodo} tempTodo={tempTodo} />

        {visibleTodos.length !== 0
          && (
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              deleteTodo={deleteTodo}
              idOfDeletedTodo={idOfDeletedTodo}
              completedTodosID={completedTodosID}
            />
          ) }

        {todos.length !== 0
          && (
            <BottomPanel
              countOfItems={visibleTodos.length}
              selectedFilter={filterOfTodo}
              changeFilterOfTodo={changeFilterOfTodo}
              deleteAllCompleted={deleteAllCompleted}
              showClearAllButton={isCompletedTodos()}
            />
          ) }
      </div>

      {hasError
        && (
          <ErrorMessage
            hasError={hasError}
            error={typeOfError}
            closeErrorMessage={closeErrorMessage}
          />
        )}
    </div>
  );
};
