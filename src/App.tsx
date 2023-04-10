import {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { deleteTodo, getTodos, postTodo } from './api/todos';

import { Todo } from './types/Todo';
import { TodoStatus } from './types/TodoStatus';
import { filterTodos } from './utils/helpers';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { NotificationError } from './components/NotificationError';
import { AddingForm } from './components/AddingForm';

const USER_ID = 6922;

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoStatus, setTodoStatus] = useState<TodoStatus>(TodoStatus.ALL);
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [error, setError] = useState('');
  const [loadingTodosId, setLoadingTodosId] = useState<number[]>([]);

  const clearNotification = () => {
    setTimeout(() => {
      setError('');
    }, 3000);
  };

  const loadTodos = useCallback(async () => {
    try {
      const loadedTodos = await getTodos(USER_ID);

      setTodos(loadedTodos);
    } catch (err) {
      setError('Can`t load todos');
      clearNotification();
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, []);

  const addTodo = useCallback(async (todoData: Omit<Todo, 'id'>) => {
    setIsInputDisabled(true);
    const newTodo = {
      ...todoData,
    };
    const temporaryTodo = {
      id: 0,
      ...todoData,
    };

    try {
      setTempTodo(temporaryTodo);
      setLoadingTodosId(currId => [...currId, temporaryTodo.id]);
      const addedTodo = await postTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, addedTodo]);
    } catch (err) {
      setError('Can`t add todo');
      clearNotification();
    } finally {
      setTempTodo(null);
    }

    setIsInputDisabled(false);
  }, []);

  const removeTodo = useCallback(async (todoId: number) => {
    setLoadingTodosId((currId) => [...currId, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos((currTodos) => currTodos.filter((todo) => todo.id !== todoId));
    } catch (err) {
      setError('Can`t delete todo');
      clearNotification();
      setLoadingTodosId([]);
    }
  }, []);

  const visibleTodos = useMemo(() => {
    return filterTodos(todos, todoStatus);
  }, [todos, todoStatus]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <AddingForm
          userId={USER_ID}
          onSubmit={addTodo}
          setError={setError}
          clearNotification={clearNotification}
          isInputDisabled={isInputDisabled}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          onTodoDelete={removeTodo}
          loadingTodosId={loadingTodosId}
        />

        {todos.length > 0 && (
          <TodoFilter
            todos={visibleTodos}
            todoStatus={todoStatus}
            setTodoStatus={setTodoStatus}
            onTodoDelete={removeTodo}
          />
        )}
      </div>

      <NotificationError error={error} setError={setError} />
    </div>
  );
};
