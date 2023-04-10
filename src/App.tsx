import {
  FC, useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { ErrorType } from './types/Error';
import { TaskStatus } from './types/Sort';
import { deleteTodo, getTodos, postTodo } from './api/todos';
import { AddTodo } from './components/AddTodo';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { Filter } from './components/Filter';
import { getFilteredTodos } from './utils/helpers';
import { DEFAULT_TASK_ID, USER_ID } from './utils/constants';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorType>(ErrorType.NONE);
  const [sortType, setSortType] = useState<TaskStatus>(TaskStatus.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [loadTodoById, setLoadTodoById] = useState([DEFAULT_TASK_ID]);

  const clearErrorMessage = () => {
    setTimeout(() => setError(ErrorType.NONE), 3000);
  };

  const fetchTodos = useCallback(async () => {
    try {
      const getData = await getTodos(USER_ID);

      setTodos(getData);
    } catch {
      setError(ErrorType.LOAD);
      clearErrorMessage();
    }
  }, []);

  const addTodo = useCallback(async (title: string) => {
    if (!title.trim()) {
      setError(ErrorType.EMPTY_TITLE);
      clearErrorMessage();

      return;
    }

    const newTodo = {
      title,
      completed: false,
      userId: USER_ID,
    };

    try {
      setIsDisabled(true);
      setTempTodo({ id: DEFAULT_TASK_ID, ...newTodo });

      const todo = await postTodo(newTodo as Todo);

      setTodos(state => [...state, todo]);
    } catch {
      setError(ErrorType.ADD);
      clearErrorMessage();
    } finally {
      setTempTodo(null);
      setIsDisabled(false);
    }
  }, []);

  const removeTodo = useCallback(async (taskId: number) => {
    try {
      setLoadTodoById(prevState => [...prevState, taskId]);

      await deleteTodo(taskId);

      setTodos(state => state.filter(({ id }) => id !== taskId));
    } catch {
      setError(ErrorType.DELETE);
      clearErrorMessage();
    } finally {
      setLoadTodoById([DEFAULT_TASK_ID]);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, []);

  const filteredTodos = useMemo(
    () => getFilteredTodos(todos, sortType),
    [todos, sortType],
  );

  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length, [todos],
  );

  const handleRemoveError = useCallback(() => {
    setError(ErrorType.NONE);
  }, []);

  const handleClearCompleted = useCallback(() => {
    todos.forEach(({ completed, id }) => {
      return completed && removeTodo(id);
    });
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <AddTodo
          onAddTodo={addTodo}
          onDisable={isDisabled}
          activeTodosCount={activeTodosCount}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          onRemove={removeTodo}
          loadTodoById={loadTodoById}
        />

        {todos && (
          <Filter
            todos={todos}
            sortType={sortType}
            onChangeSortType={setSortType}
            onRemove={handleClearCompleted}
            activeTodosCount={activeTodosCount}
          />
        )}
      </div>

      {error
        && (
          <ErrorNotification
            error={error}
            onRemoveError={handleRemoveError}
          />
        )}
    </div>
  );
};
