import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { wait } from './utils/fetchClient';
import { UserWarning } from './UserWarning';
import { Footer } from './components/Footer';
import { creatTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { TodoList } from './components/TodoList';
import { getFilterTodos } from './utils/getFilterTodos';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';
import { Errors } from './types/Errors';
// import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.Default);
  const [status, setStatus] = useState<Status>(Status.All);
  const [isLoading, setIsLoading] = useState(false);
  const [deletedTodoIds, setDeletedTodoIds] = useState<number[]>([]);

  const focusInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Errors.Load);

        wait(3000).then(() => setErrorMessage(Errors.Default));
      });
  }, []);

  useEffect(() => {
    focusInput.current?.focus();
  }, [errorMessage, todos]);

  const filteredTodos = useMemo(() => {
    return getFilterTodos(todos, status);
  }, [todos, status]);

  const handleClearError = () => setErrorMessage(Errors.Default);

  const addTodo = async (creatNewTodo: Omit<Todo, 'id'>) => {
    setTempTodo({ ...creatNewTodo, id: 0 });

    try {
      setIsLoading(true);
      const newTodo = await creatTodo(creatNewTodo);

      setTodos(currentTodos => [...currentTodos, newTodo] as Todo[]);
      setNewTitle('');
    } catch {
      setErrorMessage(Errors.Add);

      wait(3000).then(() => handleClearError());
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  };

  const removeTodo = (todoId: number) => {
    setIsLoading(true);
    setDeletedTodoIds(prevIds => [...prevIds, todoId]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(Errors.Delete);
      })
      .finally(() => {
        setDeletedTodoIds(() => []);
        setIsLoading(false);

        wait(3000).then(() => handleClearError());
      });
  };

  const handleSetStatus = (field: Status) => {
    setStatus(field);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const title = newTitle.trim();

    if (!title) {
      setErrorMessage(Errors.EmptyTitle);
      wait(3000).then(() => handleClearError());

      return;
    }

    const newTodo = {
      title,
      userId: USER_ID,
      completed: false,
    };

    addTodo(newTodo);
  };

  const handelSetNewTitle = (value: string) => {
    setNewTitle(value);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputRef={focusInput}
          onSubmit={handleSubmit}
          onChange={handelSetNewTitle}
          newTitle={newTitle}
          isLoading={isLoading}
          todos={todos}
        />

        <TodoList
          filteredTodos={filteredTodos}
          onDeleteTodo={removeTodo}
          tempTodo={tempTodo}
          deletedTodoIds={deletedTodoIds}
        />

        {!!todos.length && (
          <Footer
            onFilter={handleSetStatus}
            onDeleteTodo={removeTodo}
            currentFilterStatus={status}
            todos={todos}
            clearError={handleClearError}
            onSetError={setErrorMessage}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onDeleteError={handleClearError}
      />
    </div>
  );
};
