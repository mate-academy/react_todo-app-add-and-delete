import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './components/UserWarning';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';
import { Status } from './types/Status';
import { Todo } from './types/Todo';
import { USER_ID, deleteTodo, getTodos } from './api/todos';
import { isAllTodosCompleted } from './utils/finder';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.All);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodos, setProcessingTodos] = useState<number[]>([]);

  const fieldTitle = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  const filteredTodos = useMemo(() => {
    if (status === Status.All) {
      return todos;
    }

    return todos.filter(todo =>
      status === Status.Completed ? todo.completed : !todo.completed,
    );
  }, [status, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const onAddTodo = (todo: Todo) => {
    setTodos(prevTodos => [...prevTodos, todo]);
  };

  const onDeleteTodo = (id: number) => {
    setProcessingTodos([id]);

    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        setProcessingTodos([]);
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        fieldTitle.current?.focus();
      });
  };

  const onDeleteCompleted = () => {
    Promise.allSettled(
      todos
        .filter(todo => todo.completed)
        .map(todo => {
          setProcessingTodos(prev => [...prev, todo.id]);

          return deleteTodo(todo.id)
            .then(() =>
              setTodos(prevTodos =>
                prevTodos.filter(prevTodo => prevTodo.id !== todo.id),
              ),
            )
            .catch(() => setErrorMessage('Unable to delete a todo'));
        }),
    ).then(() => {
      fieldTitle.current?.focus();
      setProcessingTodos([]);
    });
  };

  const handleCompletedStatus = (id: number) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo,
    );

    setTodos(updatedTodos);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAdd={onAddTodo}
          isAllTodosCompleted={isAllTodosCompleted(todos)}
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          fieldTitle={fieldTitle}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          onDelete={onDeleteTodo}
          processingTodos={processingTodos}
          handleCompletedStatus={handleCompletedStatus}
        />

        {!!todos.length && (
          <TodoFilter
            setStatus={setStatus}
            status={status}
            todos={todos}
            onDeleteCompleted={onDeleteCompleted}
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
