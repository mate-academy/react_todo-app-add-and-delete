import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './Types/Todo';
import { List } from './Components/List';
import { Header } from './Components/Header';
import { Footer } from './Components/Footer';
import { ErrorNotification } from './Components/ErrorNotifications';
import { Status } from './Types/Status';
import { isAllTodosCompleted } from './Utilites/FinderUtils';
import { USER_ID, deleteTodo, getTodos } from './Components/Todos';

export const App: React.FC = () => {
  const [newStatus, setNewStatus] = useState<Status>(Status.All);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [processingTodos, setProcessingTodos] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const fieldTitle = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  const filteredTodos = useMemo(() => {
    if (newStatus === Status.All) {
      return todos;
    }

    return todos.filter(todo =>
      newStatus === Status.Completed ? todo.completed : !todo.completed,
    );
  }, [newStatus, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

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

        <List
          todos={filteredTodos}
          tempTodo={tempTodo}
          onDelete={onDeleteTodo}
          processingTodos={processingTodos}
          handleCompletedStatus={handleCompletedStatus}
        />

        {!!todos.length && (
          <Footer
            setStatus={setNewStatus}
            status={newStatus} // Correct prop name
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
