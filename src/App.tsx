/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { ErrorMessage } from './components/Error';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/todosList';
import { Error } from './types/Error';
import { Status } from './types/Status';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

const USER_ID = 6366;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.All);
  const [error, setError] = useState<Error>(Error.NONE);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const setErrorStatus = (newError: Error) => {
    setError(newError);

    setTimeout(() => {
      setError(Error.NONE);
    }, 3000);
  };

  const fetchTodos = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setErrorStatus(Error.FETCH);
    }
  };

  const addNewTodo = async (title: string) => {
    if (title.trim() === '') {
      setErrorStatus(Error.FORM);

      return;
    }

    const todoToAdd = {
      title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ ...todoToAdd, id: 0 });

    try {
      const response = await addTodo(USER_ID, todoToAdd);

      setTodos(currentTodos => [...currentTodos, response]);
    } catch {
      setErrorStatus(Error.ADD);
    } finally {
      setTempTodo(null);
    }
  };

  const deleteChosenTodo = async (todoId: number) => {
    try {
      await deleteTodo(USER_ID, todoId);

      setTodos((currentTodos) => (
        currentTodos.filter(({ id }) => id !== todoId)
      ));
    } catch {
      setErrorStatus(Error.DELETE);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const todosByStatus = useMemo(() => (
    status === Status.All
      ? todos
      : todos.filter(({ completed }) => (
        status === Status.COMPLETED ? completed : !completed
      ))
  ), [status, todos]);

  const activeCount = useMemo(() => (
    todos.reduce((acc, todo) => (
      todo.completed ? acc : acc + 1
    ), 0)
  ), [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header addNewTodo={addNewTodo} />
        {
          todos.length !== 0 && (
            <TodoList
              todos={todosByStatus}
              onDelete={deleteChosenTodo}
              tempTodo={tempTodo}
            />
          )
        }

        {
          todos.length !== 0 && (
            <Footer
              todos={todos}
              activeCount={activeCount}
              status={status}
              setStatus={setStatus}
              onDelete={deleteChosenTodo}
            />
          )
        }
      </div>
      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorMessage error={error} onDeleteClick={setError} />
    </div>
  );
};
