import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { Todo } from './types/Todo';
import { TodoStatusFilter } from './types/TodoStatusFilter';
import { createTodo, deleteTodo, getTodos } from './api/todos';

const USER_ID = 10684;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [statusFilter, setStatusFilter] = useState(TodoStatusFilter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([0]);
  const [todoTitle, setTodoTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then((todosFromServer) => {
        setTodos(todosFromServer);
      })
      .catch((errorFromServer) => {
        setError(errorFromServer.message);
      });
  }, []);

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (error) {
      timerId = setTimeout(() => {
        setError(null);
      }, 3000);
    }

    return () => clearTimeout(timerId);
  }, [error]);

  const completedTodos = useMemo(() => {
    return todos.filter((todo) => todo.completed);
  }, [todos, statusFilter]);

  const activeTodos = useMemo(() => {
    return todos.filter((todo) => !todo.completed);
  }, [todos, statusFilter]);

  const visibleTodos = useMemo(() => {
    return todos.filter((todo) => {
      let status: boolean;

      switch (statusFilter) {
        case TodoStatusFilter.Active:
          status = !todo.completed;
          break;

        case TodoStatusFilter.Completed:
          status = todo.completed;
          break;

        default:
          status = true;
      }

      return status;
    });
  }, [todos, statusFilter]);

  const closeErrorNotification = useCallback(() => {
    setError(null);
  }, []);

  const changeStatusFilter = useCallback((status: TodoStatusFilter) => {
    setStatusFilter(status);
  }, []);

  const changeErrorMessage = useCallback((errorMessage: string) => {
    setError(errorMessage);
  }, []);

  const changeTodoTitle = useCallback((value: string) => {
    setTodoTitle(value);
  }, []);

  const addTodo = useCallback(async (title: string) => {
    try {
      const newTodo = {
        title,
        completed: false,
        userId: USER_ID,
      };

      setTempTodo({
        ...newTodo,
        id: 0,
      });

      const createdTodo = await createTodo(newTodo);

      setTodos(currentTodos => [...currentTodos, createdTodo]);
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setTodoTitle('');
    }
  }, [USER_ID, todos]);

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      setLoadingTodos((currentTodos) => [...currentTodos, todoId]);
      await deleteTodo(todoId);
      setTodos((currentTodos) => (
        currentTodos.filter((todo) => todo.id !== todoId)
      ));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setLoadingTodos((currentTodos) => (
        currentTodos.filter((id) => id !== todoId)
      ));
    }
  }, [loadingTodos]);

  const clearCompleted = useCallback(() => {
    completedTodos.forEach(async (todo) => {
      await removeTodo(todo.id);
    });
  }, [completedTodos]);

  const activeTodosLeft = activeTodos.length;

  const isTodosVisible = todos.length > 0 || Boolean(tempTodo);
  const isClearCompletedVisible = completedTodos.length > 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todoTitle={todoTitle}
          changeTodoTitle={changeTodoTitle}
          changeError={changeErrorMessage}
          addTodo={addTodo}
        />

        {isTodosVisible && (
          <>
            <TodoList
              todos={visibleTodos}
              loadingTodos={loadingTodos}
              tempTodo={tempTodo}
              removeTodo={removeTodo}
            />

            <TodoFooter
              statusFilter={statusFilter}
              changeStatusFilter={changeStatusFilter}
              clearCompleted={clearCompleted}
              activeTodosLeft={activeTodosLeft}
              isVisible={isClearCompletedVisible}
            />
          </>
        )}
      </div>

      {error && (
        <ErrorNotification
          error={error}
          onClose={closeErrorNotification}
        />
      )}
    </div>
  );
};
