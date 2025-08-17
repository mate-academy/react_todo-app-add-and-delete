/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, addTodo, USER_ID, deleteTodo } from './api/todos';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { Filter } from './components/Filter/Filter';
import { FilterStatus } from './types/FilterStatus';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | ''>('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [loadingTodosIDs, setloadingTodosIDs] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const isLoading = loadingTodosIDs.length > 0;
    const isTempTodo = !!tempTodo;

    if (!isAdding && !isLoading && !isTempTodo) {
      inputRef.current?.focus();
    }
  }, [isAdding, tempTodo, loadingTodosIDs.length]);

  const loadTodos = async () => {
    setErrorMessage('');

    try {
      const todosFromServer = await getTodos();

      if (!todosFromServer.length) {
        setErrorMessage(ErrorMessage.LoadTodos);
      }

      setTodos(todosFromServer);
    } catch (err) {
      setErrorMessage(ErrorMessage.LoadTodos);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    const timerId = errorMessage
      ? setTimeout(() => setErrorMessage(''), 3000)
      : null;

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [errorMessage]);

  const visibleTodos = todos.filter(todo => {
    switch (filterStatus) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const handleAddTodo = async (todoTitle: string) => {
    if (!todoTitle.trim()) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: todoTitle.trim(),
      completed: false,
    };

    setIsAdding(true);
    setTempTodo({ ...newTodo, id: 0 });

    try {
      const createdTodo = await addTodo(newTodo);

      setTodos(currentTodos => [...currentTodos, createdTodo]);
      setTitle('');
    } catch {
      setErrorMessage(ErrorMessage.AddTodo);
    } finally {
      setIsAdding(false);
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setloadingTodosIDs(current => [...current, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage(ErrorMessage.DeleteTodo);
    } finally {
      setloadingTodosIDs(current => current.filter(id => id !== todoId));
    }
  };

  const handleDeleteCompleted = async () => {
    const idsToDelete = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    if (!idsToDelete.length) {
      return;
    }

    setloadingTodosIDs(current => [...current, ...idsToDelete]);

    const results = await Promise.allSettled(
      idsToDelete.map(id => deleteTodo(id)),
    );

    const failedIds = results
      .map((result, index) =>
        result.status === 'rejected' ? idsToDelete[index] : null,
      )
      .filter((id): id is number => id !== null);

    setTodos(prevTodos =>
      prevTodos.filter(todo => !todo.completed || failedIds.includes(todo.id)),
    );

    if (failedIds.length > 0) {
      setErrorMessage(ErrorMessage.DeleteTodo);
    }

    setloadingTodosIDs(current =>
      current.filter(id => !idsToDelete.includes(id)),
    );
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          inputRef={inputRef}
          handleAddTodo={handleAddTodo}
          isAdding={isAdding}
          title={title}
          setTitle={setTitle}
        />

        <TodoList
          todos={visibleTodos}
          onDelete={handleDeleteTodo}
          loadingTodosIDs={loadingTodosIDs}
          tempTodo={tempTodo}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Filter
            todos={todos}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            onDeleteCompleted={handleDeleteCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
