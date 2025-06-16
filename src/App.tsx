/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, postTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { StatusTodos } from './types/StatusTodos';
import { ErrorNotificationMessage } from './types/ErrorNotificationMessage';

const prepereTodos = (todos: Todo[], statusTodos: StatusTodos) => {
  switch (statusTodos) {
    case StatusTodos.Completed:
      return todos.filter(todo => todo.completed);
    case StatusTodos.Active:
      return todos.filter(todo => !todo.completed);
    default:
      return todos;
  }
};

export const App: React.FC = () => {
  const [isLoadingTodos, setIsLoadingTodos] = useState(true);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [deletedTodoId, setDeletedTodoId] = useState<Todo['id']>(0);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState(
    ErrorNotificationMessage.Cleared,
  );

  const [inputForAddTodo, setInputForAddTodo] = useState('');
  const [selectStatusTodos, setSelectStatusTodos] = useState(StatusTodos.All);

  const visibleTodos = prepereTodos(todos, selectStatusTodos);

  useEffect(() => {
    setIsLoadingTodos(true);
    setErrorMessage(ErrorNotificationMessage.Cleared);

    getTodos()
      .then(setTodos)
      .catch(error => {
        setErrorMessage(ErrorNotificationMessage.UnableToLoadTodos);
        throw error;
      })
      .finally(() => setIsLoadingTodos(false));
  }, []);

  const handleAddTodo = async ({
    title,
    completed,
    userId,
  }: Omit<Todo, 'id'>) => {
    const temp = { id: 0, title, completed, userId };

    setTempTodo(temp);

    try {
      const newTodo = await postTodo({ title, completed, userId });

      setTodos(currentTodos => [...currentTodos, newTodo]);
      setInputForAddTodo('');
    } catch (error) {
      setErrorMessage(ErrorNotificationMessage.UnableToAddTodos);
    } finally {
      setTempTodo(null);
    }
  };

  const handdleDeleteTodo = async (todoId: Todo['id']) => {
    try {
      await deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(ErrorNotificationMessage.UnableToDeleteTodos);
        throw error;
      }
    } finally {
      setTempTodo(null);
    }
  };

  const handleDeleteCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.map(todo =>
      deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(currTodo => currTodo.id !== todo.id),
          );
        })
        .catch(() => {
          setErrorMessage(ErrorNotificationMessage.UnableToDeleteTodos);
        }),
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
          inputForAddTodo={inputForAddTodo}
          onChangeInput={setInputForAddTodo}
          addTodo={handleAddTodo}
          onErrorMessage={setErrorMessage}
          todosLength={todos.length}
        />

        {/* This is a completed todo */}
        {isLoadingTodos ? (
          'Loading....'
        ) : (
          <TodoList
            visibleTodos={visibleTodos}
            // deleteTodo={handleDeleteTodo}
            deletedTodoId={deletedTodoId}
            changeDeletedTodoId={setDeletedTodoId}
            tempTodo={tempTodo}
            onDeleteTodo={handdleDeleteTodo}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && !isLoadingTodos && (
          <Footer
            todos={todos}
            selectStatusTodos={selectStatusTodos}
            onChangeStatusTodos={setSelectStatusTodos}
            onDeleteCompleted={handleDeleteCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessage={errorMessage}
        onErrorMessage={setErrorMessage}
      />
    </div>
  );
};
