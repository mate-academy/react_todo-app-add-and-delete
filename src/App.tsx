import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { wait } from './utils/fetchClient';
import { UserWarning } from './UserWarning';
import { Footer } from './components/Footer';
import { addNewTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { TodoList } from './components/Todolist';
import { Error } from './components/Error';
import { Header } from './components/Header';
import { Errors } from './types/Errors';
import { getFilteredTodos } from './utils/getFilteredTodos';

// eslint-disable-next-line @typescript-eslint/no-shadow

export const App: React.FC = () => {
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.Default);
  const [deletTodo, setDeletTodo] = useState<number[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [filterStatus, setFilterStatus] = useState<Status>(Status.All);
  const [IsLoading, setIsLoading] = useState(false);

  const focusInput = useRef<HTMLInputElement>(null);

  const handleClearError = () => setErrorMessage(Errors.Default);

  const handleError = (error: Errors) => {
    setErrorMessage(error);

    wait(3000).then(() => handleClearError());
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        handleError(Errors.Load);
      });
  }, []);

  useEffect(() => {
    focusInput.current?.focus();
  }, [errorMessage, todos]);

  const filteredTodos = useMemo(() => {
    return getFilteredTodos(todos, filterStatus);
  }, [todos, filterStatus]);

  const addTodo = async (createdNewTodo: Omit<Todo, 'id'>) => {
    setSelectedTodo({ ...createdNewTodo, id: 0 });

    try {
      setIsLoading(true);
      const newTodo = await addNewTodo(createdNewTodo);

      setTodos(currentTodos => [...currentTodos, newTodo] as Todo[]);
      setNewTitle('');
    } catch {
      handleError(Errors.Add);
    } finally {
      setSelectedTodo(null);
      setIsLoading(false);
    }
  };

  const deletedTodo = async (todoId: number) => {
    try {
      setDeletTodo(prevIds => [...prevIds, todoId]);
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      handleError(Errors.Delete);
    } finally {
      setDeletTodo(prevIds => prevIds.filter(id => id !== todoId));
    }
  };

  const handleSetStatus = (field: Status) => {
    setFilterStatus(field);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const title = newTitle.trim();

    if (!title) {
      handleError(Errors.EmptyTitle);

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
          isLoading={IsLoading}
          todos={todos}
        />

        <TodoList
          filteredTodos={filteredTodos}
          onDeleteTodo={deletedTodo}
          tempTodo={selectedTodo}
          deletedTodoIds={deletTodo}
        />

        {!!todos.length && (
          <Footer
            onFilter={handleSetStatus}
            onDeleteTodo={deletedTodo}
            currentFilterStatus={filterStatus}
            todos={todos}
            onClearError={handleError}
          />
        )}
      </div>

      <Error errorMessage={errorMessage} onDeleteError={handleClearError} />
    </div>
  );
};
