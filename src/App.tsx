import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, addTodo, deleteTodo, getTodos } from './api/todos';
import { Todos } from './components/Todos';
import { Todo } from './types/Todo';
import { ErrorMessages } from './types/Error';
import { Error } from './components/Error';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldFocus, setShouldFocus] = useState(true);

  const loadTodos = async () => {
    setErrorMessage(null);

    try {
      const todosFromServer = await getTodos();

      setTodos(todosFromServer);
    } catch {
      setErrorMessage(ErrorMessages.UnableToLoadTodos);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [errorMessage]);

  const handleEmptyErrorMessage = () => {
    setErrorMessage(ErrorMessages.TitleShouldNotBeEmpty);
  };

  const handleAddTodo = async (title: string) => {
    const newTempTodo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(newTempTodo);
    setIsLoading(true);

    try {
      const newTodo = await addTodo(title);

      setTodos(currentTodos => [...currentTodos, newTodo]);
      setTempTodo(null);
    } catch (error) {
      setErrorMessage(ErrorMessages.UnableToAddTodo);
      setTempTodo(null);
      throw error;
    } finally {
      setIsLoading(false);
      setShouldFocus(true);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setIsLoading(true);
    setDeletingTodoId(id);

    try {
      await deleteTodo(id);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
    } catch {
      setErrorMessage(ErrorMessages.UnableToDeleteTodo);
    } finally {
      setDeletingTodoId(null);
      setIsLoading(false);
      setShouldFocus(true);
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const deletePromises = completedTodos.map(todo => deleteTodo(todo.id));

    setIsLoading(true);
    setShouldFocus(false);

    try {
      const results = await Promise.allSettled(deletePromises);
      const successfulDeletes = results
        .map((result, index) =>
          result.status === 'fulfilled' ? completedTodos[index].id : null,
        )
        .filter(id => id !== null);

      setTodos(currentTodos =>
        currentTodos.filter(todo => !successfulDeletes.includes(todo.id)),
      );

      const hasError = results.some(result => result.status === 'rejected');

      if (hasError) {
        setErrorMessage(ErrorMessages.UnableToDeleteTodo);
      }
    } catch {
      setErrorMessage(ErrorMessages.UnableToDeleteTodo);
    } finally {
      setIsLoading(false);
      setShouldFocus(true);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <Todos
        todos={todos}
        tempTodo={tempTodo}
        isLoading={isLoading}
        deletingTodoId={deletingTodoId}
        onEmptyTitleError={handleEmptyErrorMessage}
        onAddTodo={handleAddTodo}
        onDelete={handleDeleteTodo}
        onClearCompleted={handleClearCompleted}
        shouldFocus={shouldFocus}
      />

      <Error
        errorMessage={errorMessage}
        clearErrorMessage={() => setErrorMessage(null)}
      />
    </div>
  );
};
