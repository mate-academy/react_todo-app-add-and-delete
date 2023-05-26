import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { Todo } from './types/Todo';
import { FilterOption } from './types/FilterOption';
import { getTodos, createTodo, deleteTodo } from './api/todos';
import { AddTodoInput } from './components/AddTodoInput';
import { Footer } from './components/Footer';
import { Alert } from './components/Alert';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './types/ErrorMessage';

const USER_ID = 10527;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FilterOption.All);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const visibleTodos: Todo[] = useMemo(() => {
    return todos.filter((todo) => {
      switch (filter) {
        case FilterOption.Completed:
          return todo.completed;

        case FilterOption.Active:
          return !todo.completed;

        default:
          return true;
      }
    });
  }, [todos, filter]);

  const hasError = errorMessage !== '';

  const handleAlert = useCallback((alertMessage: string) => {
    setErrorMessage(alertMessage);

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, []);

  const loadTodos = useCallback(async () => {
    setIsLoading(true);

    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      handleAlert(ErrorMessage.Load);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAddTodo = useCallback(async (newTodo: Todo) => {
    setTempTodo(newTodo);

    setIsLoading(true);

    try {
      const todoToAdd = await createTodo({
        id: 0,
        title: newTodo.title,
        completed: false,
        userId: USER_ID,
      });

      setTodos((prevTodos) => [...prevTodos, todoToAdd]);
    } catch {
      handleAlert(ErrorMessage.Add);
    } finally {
      setIsLoading(false);
      setTempTodo(null);
    }
  }, []);

  const handleDelete = useCallback(
    async (todoId: number) => {
      setIsLoading(true);

      try {
        await deleteTodo(todoId);

        const filteredTodos = visibleTodos.filter((todo) => todo.id !== todoId);

        setTodos(filteredTodos);
      } catch (error) {
        handleAlert(ErrorMessage.Delete);
      } finally {
        setIsLoading(false);
      }
    },
    [visibleTodos],
  );

  useEffect(() => {
    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              aria-label="Toggle all todos"
              className="todoapp__toggle-all active"
            />
          )}

          <AddTodoInput
            handleAddTodo={handleAddTodo}
            handleAlert={handleAlert}
          />
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              handleDelete={handleDelete}
              isLoading={isLoading}
            />

            <Footer todos={todos} filter={filter} setFilter={setFilter} />
          </>
        )}
      </div>

      {hasError && <Alert message={errorMessage} />}
    </div>
  );
};
