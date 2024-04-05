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

export const App: React.FC = () => {
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.Default);
  const [deletet, setDeletet] = useState<number[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [status, setStatus] = useState<Status>(Status.All);
  const [loading, setIsLoading] = useState(false);

  const focusInput = useRef<HTMLInputElement>(null);

  const handleClearError = () => setErrorMessage(Errors.Default);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const getFilterTodos = (todos: Todo[], filterField: Status) => {
    switch (filterField) {
      case Status.Active:
        return todos.filter(todo => !todo.completed);
      case Status.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

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
    return getFilterTodos(todos, status);
  }, [todos, status]);

  const addTodo = async (creatNewTodo: Omit<Todo, 'id'>) => {
    setTempTodo({ ...creatNewTodo, id: 0 });

    try {
      setIsLoading(true);
      const newTodo = await addNewTodo(creatNewTodo);

      setTodos(currentTodos => [...currentTodos, newTodo] as Todo[]);
      setNewTitle('');
    } catch {
      handleError(Errors.Add);
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  };

  const deleted = async (todoId: number) => {
    try {
      setDeletet(prevIds => [...prevIds, todoId]);
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      handleError(Errors.Delete);
    } finally {
      setDeletet(prevIds => prevIds.filter(id => id !== todoId));
    }
  };

  const handleSetStatus = (field: Status) => {
    setStatus(field);
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
          isLoading={loading}
          todos={todos}
        />

        <TodoList
          filteredTodos={filteredTodos}
          onDeleteTodo={deleted}
          tempTodo={tempTodo}
          deletedTodoIds={deletet}
        />

        {!!todos.length && (
          <Footer
            onFilter={handleSetStatus}
            onDeleteTodo={deleted}
            currentFilterStatus={status}
            todos={todos}
            onClearError={handleError}
          />
        )}
      </div>

      <Error errorMessage={errorMessage} onDeleteError={handleClearError} />
    </div>
  );
};
