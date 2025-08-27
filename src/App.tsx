/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { createTodos, deleteTodos, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import cn from 'classnames';
import { Footer } from './components/Footer/Footer';
import { TodoFilter } from './types/TodoFilter';
import { Header } from './components/Header/Header';

function preperedData(dataTodos: Todo[], groupBy: string): Todo[] {
  let visibleTodos = [...dataTodos];

  visibleTodos = visibleTodos.filter((todos: Todo) => {
    switch (groupBy) {
      case TodoFilter.Active:
        return todos.completed === false;

      case TodoFilter.Completed:
        return todos.completed === true;

      default:
        return true;
    }
  });

  return visibleTodos;
}

export const App: React.FC = () => {
  const [todosDataFromServer, setodosDataFromServer] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loadingStartWindow, setLoadingStartWindow] = useState<boolean>(false);
  const [groupBy, setGroupBy] = useState<TodoFilter>(TodoFilter.All);
  const [isFocusHeaderInput, setIsFocusHeaderInput] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoadingSpinner, setIsLoadingSpinner] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Omit<Todo, 'userId'> | null>(null);
  const [listDeleteTodoId, setListDeleteTodoId] = useState<number[]>([]);

  const visibleData = preperedData(todosDataFromServer, groupBy);

  const loadTodos = () => {
    setErrorMessage('');
    setLoadingStartWindow(true);
    getTodos()
      .then((todosFromServer: Todo[]) => {
        setodosDataFromServer(todosFromServer);
      })
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => setLoadingStartWindow(false));
  };

  const errorTimeOut = (errorNotification: string) => {
    let timerId: NodeJS.Timeout | number | undefined;

    if (errorNotification) {
      timerId = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  };

  const handleGroupBy = (typeGroupBy: TodoFilter) => {
    setGroupBy(typeGroupBy);
  };

  const handleEmptyInputError = () => {
    if (inputValue.trim().length === 0) {
      setErrorMessage('Title should not be empty');
    } else {
      setErrorMessage('');
    }
  };

  function addTodo({ title, completed }: Omit<Todo, 'id' | 'userId'>) {
    setErrorMessage('');
    setIsFocusHeaderInput(false);
    setIsLoadingSpinner(true);
    createTodos({ title, completed, userId: USER_ID })
      .then(newTodo => {
        setInputValue('');
        setodosDataFromServer(prevTodos => [...prevTodos, newTodo]);
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setIsLoadingSpinner(false);
        setIsFocusHeaderInput(true);
        setTempTodo(null);
      });
  }

  function removeTodo(todoId: number) {
    setListDeleteTodoId(prev => [...prev, todoId]);
    setErrorMessage('');
    setIsFocusHeaderInput(false);
    setIsLoadingSpinner(true);
    deleteTodos(todoId)
      .then(() => {
        setodosDataFromServer(prevTodos =>
          prevTodos.filter(todo => todo.id !== todoId),
        );
        setListDeleteTodoId([]);
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setIsLoadingSpinner(false);
        setIsFocusHeaderInput(true);
      });
  }

  const handleDeleteAllCompleted = () => {
    const completedTodos = todosDataFromServer.filter(
      todo => todo.completed === true,
    );

    completedTodos.forEach(todo => removeTodo(todo.id));
  };

  const handleInputValue = (event: string) => {
    setInputValue(event);
  };

  const handleTempTodo = (temporaryTodo: Omit<Todo, 'userId'>) => {
    setTempTodo(temporaryTodo);
  };

  const isFullTodosCompleted = useMemo(() => {
    return todosDataFromServer.every((todo: Todo) => todo.completed === true);
  }, [todosDataFromServer]);

  const isOneTodosCompleted = useMemo(() => {
    return todosDataFromServer.some((todo: Todo) => todo.completed === true);
  }, [todosDataFromServer]);

  const completedCount = useMemo(() => {
    return todosDataFromServer.filter(todo => !todo.completed).length;
  }, [todosDataFromServer]);

  const isShowElement = !loadingStartWindow && todosDataFromServer.length > 0;

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    errorTimeOut(errorMessage);
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isShowElement={isShowElement}
          isFocusHeaderInput={isFocusHeaderInput}
          handleEmptyInputError={handleEmptyInputError}
          inputValue={inputValue}
          onInputChange={handleInputValue}
          onSubmit={addTodo}
          onSubmitAddTempTodo={handleTempTodo}
          isFullTodosCompleted={isFullTodosCompleted}
          isLoadingSpinner={isLoadingSpinner}
        />

        {isShowElement && (
          <TodoList
            visibleData={visibleData}
            isLoadingSpinner={isLoadingSpinner}
            tempTodo={tempTodo}
            onClickDeleteTodo={removeTodo}
            listDeleteTodoId={listDeleteTodoId}
          />
        )}
        {/* Hide the footer if there are no todos */}

        {isShowElement && (
          <Footer
            completedCount={completedCount}
            onHandleGroupBy={handleGroupBy}
            groupBy={groupBy}
            isOneTodosCompleted={isOneTodosCompleted}
            onClickDeleteAllCompleted={handleDeleteAllCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: errorMessage.length === 0 },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {/* show only one message at a time */}
        {errorMessage}
        {/* <br />
        Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};
