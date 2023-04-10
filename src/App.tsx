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
import { Notification } from './components/Notification';
import { Filter } from './components/Filter';
import { getFilteredTodos } from './utils/helpers';
import { DEFAULT_TASK_ID } from './utils/constants';

const USER_ID = 6972;

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorType>(ErrorType.NONE);
  const [sortType, setSortType] = useState<TaskStatus>(TaskStatus.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [loadTodoById, setLoadTodoById] = useState([DEFAULT_TASK_ID]);
  const fetchTodos = async () => {
    try {
      const getData = await getTodos(USER_ID);

      setTodos(getData);
    } catch {
      setError(ErrorType.LOAD);
      setTimeout(() => setError(ErrorType.NONE), 3000);
    }
  };

  const addTodo = async (title: string) => {
    if (!title.trim()) {
      setError(ErrorType.EMPTY_TITLE);
      setTimeout(() => setError(ErrorType.NONE), 3000);

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
    } finally {
      setError(ErrorType.NONE);
      setTempTodo(null);
      setIsDisabled(false);
    }
  };

  const removeTodo = async (taskId: number) => {
    try {
      setLoadTodoById(prevState => [...prevState, taskId]);

      await deleteTodo(taskId);

      setTodos(state => state.filter(({ id }) => id !== taskId));
    } catch {
      setError(ErrorType.DELETE);
    } finally {
      setLoadTodoById([DEFAULT_TASK_ID]);
      setError(ErrorType.NONE);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleDeleteTodo = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        removeTodo(todo.id);
      }
    });
  }, [todos]);

  const filteredTodos = useMemo(
    () => getFilteredTodos(todos, sortType),
    [todos, sortType],
  );

  const activeTodosLength = useMemo(
    () => todos.filter(todo => !todo.completed).length, [todos],
  );

  const handleRemoveError = () => {
    setError(ErrorType.NONE);
  };

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
          activeTodosLength={activeTodosLength}
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
            onRemove={handleDeleteTodo}
            activeTodosLength={activeTodosLength}
          />
        )}
      </div>

      {error
        && (
          <Notification
            error={error}
            onRemoveError={handleRemoveError}
          />
        )}
    </div>
  );
};
