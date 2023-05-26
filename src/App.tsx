import React, { useEffect, useMemo, useState } from 'react';
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
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const handleAlert = (alertMessage: string) => {
    setErrorMessage(alertMessage);
    setHasError(true);

    setTimeout(() => {
      setHasError(false);
      setErrorMessage('');
    }, 3000);
  };

  const loadTodos = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      handleAlert(ErrorMessage.Load);
    }
  };

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

  const addTodo = async () => {
    if (!title) {
      handleAlert(ErrorMessage.EmptyTitle);

      return;
    }

    try {
      const todo = {
        title,
        id: 0,
        userId: USER_ID,
        completed: false,
      };

      setIsLoading(true);

      await createTodo(todo);
      setTempTodo(todo);

      loadTodos();

      setIsLoading(false);
      setTitle('');
    } catch {
      handleAlert(ErrorMessage.Add);
    } finally {
      setTempTodo(null);
    }
  };

  const handleDelete = async (todoId: number) => {
    try {
      await deleteTodo(todoId);

      const filteredTodos = visibleTodos.filter((todo) => todo.id !== todoId);

      setTodos(filteredTodos);
    } catch (error) {
      handleAlert(ErrorMessage.Delete);
    }
  };

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
            title={title}
            setTitle={setTitle}
            addTodo={addTodo}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              handleDelete={handleDelete}
            />

            <Footer todos={todos} filter={filter} setFilter={setFilter} />
          </>
        )}
      </div>

      {hasError && <Alert errorMessage={errorMessage} />}
    </div>
  );
};
