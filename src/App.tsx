/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './components/ErrorMessage';
import { Errors } from './types/Errors';
import { Status } from './types/Status';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.Empty);
  const [status, setStatus] = useState<string>(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingComleted, setIsDeletingCompleted] = useState(false);

  useEffect(() => {
    todoService
      .getTodos()
      .then(data => setTodos(data))
      .catch(() => {
        setErrorMessage(Errors.UnableToLoad);
      });
  }, []);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = todos.filter(todo => {
    if (
      status === Status.All ||
      (status === Status.Completed && todo.completed) ||
      (status === Status.Active && !todo.completed)
    ) {
      return true;
    } else {
      return false;
    }
  });

  const notCompletedTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  function onCreateTodo({ userId, title, completed }: Todo) {
    setErrorMessage(Errors.Empty);

    return todoService
      .createTodo({ userId, title, completed })
      .then(newTodo => {
        setTodos(curentTodos => [...curentTodos, newTodo]);
      })
      .catch(error => {
        setErrorMessage(Errors.UnableToAdd);

        throw error;
      });
  }

  function onDeleteTodo(todoId: number) {
    return todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(error => {
        setErrorMessage(Errors.UnableToDelete);

        throw error;
      });
  }

  function onClearCompletedTodos() {
    setIsDeletingCompleted(true);
    setErrorMessage(Errors.Empty);

    const completedTodos = todos.filter(todo => todo.completed);
    const completedTodoIds = completedTodos.map(todo => todo.id);

    Promise.allSettled(completedTodoIds.map(id => todoService.deleteTodo(id)))
      .then(deleteResults => {
        const successfulDeleteIds = completedTodoIds.filter(
          (_, index) => deleteResults[index].status === 'fulfilled',
        );

        setTodos(currentTodos =>
          currentTodos.filter(todo => !successfulDeleteIds.includes(todo.id)),
        );

        const hasErrors = deleteResults.some(
          result => result.status === 'rejected',
        );

        if (hasErrors) {
          setErrorMessage(Errors.UnableToDelete);
        }
      })
      .catch(() => {
        setErrorMessage(Errors.UnableToDelete);
      })
      .finally(() => setIsDeletingCompleted(false));
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onCreateTodo={onCreateTodo}
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          tempTodo={tempTodo}
          isDeleting={isDeleting}
          isDeletingComleted={isDeletingComleted}
        />
        <TodoList
          todos={filteredTodos}
          onDeleteTodo={onDeleteTodo}
          tempTodo={tempTodo}
          isDeleting={isDeleting}
          setIsDeleting={setIsDeleting}
        />
        {!!todos.length && (
          <Footer
            notCompletedTodosCount={notCompletedTodosCount}
            completedTodosCount={completedTodosCount}
            status={status}
            setStatus={setStatus}
            onClearCompletedTodos={onClearCompletedTodos}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
