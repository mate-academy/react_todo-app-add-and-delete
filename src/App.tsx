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
  const [filter, setFilter] = useState<string>(FilterOption.All);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isBeingAdded, setIsBeingAdded] = useState<boolean>(false);
  const [isClearingDoneTodos, setIsClearingDoneTodos]
    = useState<boolean>(false);
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
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      handleAlert(ErrorMessage.Load);
    }
  }, []);

  const handleAddTodo = useCallback(async (newTodo: Todo) => {
    setTempTodo(newTodo);

    setIsBeingAdded(true);

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
      setIsBeingAdded(false);
      setTempTodo(null);
    }
  }, []);

  const handleDelete = useCallback(
    async (todoId: number) => {
      try {
        await deleteTodo(todoId);

        const filteredTodos = todos.filter((todo) => todo.id !== todoId);

        setTodos(filteredTodos);
      } catch (error) {
        handleAlert(ErrorMessage.Delete);
      }
    },
    [todos],
  );

  // Get an array of ids for completed todos
  const completedIds = useMemo(
    () => visibleTodos.filter((todo) => todo.completed).map((todo) => todo.id),
    [visibleTodos],
  );

  const handleClearCompleted = useCallback(async () => {
    setIsClearingDoneTodos(true);

    try {
      // Delete completed todos in parallel using Promise.all()
      await Promise.all(completedIds.map((id) => deleteTodo(id)));

      // Remove completed todos from visibleTodos
      const uncompletedTodos = todos.filter(
        (todo) => !completedIds.includes(todo.id),
      );

      setTodos(uncompletedTodos);
    } catch (error) {
      handleAlert(ErrorMessage.Delete);
    } finally {
      setIsClearingDoneTodos(false);
    }
  }, [todos, visibleTodos]);

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
              isBeingAdded={isBeingAdded}
              isClearingDoneTodos={isClearingDoneTodos}
            />

            <Footer
              todos={todos}
              filter={filter}
              setFilter={setFilter}
              handleClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      {hasError && <Alert message={errorMessage} />}
    </div>
  );
};
