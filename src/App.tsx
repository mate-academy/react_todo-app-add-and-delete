/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import * as todosServers from '../src/utils/fetchClient';
import Footer from './commponents/Footer';
import Header from './commponents/Header';
import TodoList from './commponents/TodoList';
import ErrorMessage from './commponents/ErrorMessage';
import { ErrorMessages } from './constanst/errors';

type Status = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  //  #region States
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.None,
  );
  const [filterStatus, setFilterStatus] = useState<Status>('all');
  const [inputValue, setInputValue] = useState<string>('');

  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  //  #endregion

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputREf = useRef<HTMLInputElement | null>(null);

  // #region useEffects
  // useEffect(() => {
  //   if (todos.length > prevTodosLength.current) {
  //     inputREf.current?.focus();
  //   }

  //   prevTodosLength.current = todos.length;
  // }, [todos]);

  useEffect(() => {
    if (isAdding) {
      inputREf.current?.focus();
      setIsAdding(false);
    }
  }, [isAdding]);

  useEffect(() => {
    if (errorMessage) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const id = setTimeout(() => {
        setErrorMessage(ErrorMessages.None);
      }, 4000);

      timeoutRef.current = id;
    }
  }, [errorMessage]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessages.LoadTodos);
        // throw err;
      });
  }, []);
  //  #endregion
  // #region functions
  function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  }

  function handleSubmitForm(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setIsDisabled(true);

    if (inputValue.trim().length < 1) {
      setErrorMessage(ErrorMessages.EmptyTitle);
      setIsDisabled(false);

      return;
    }

    const tempTod = {
      id: 0,
      userId: USER_ID,
      title: inputValue,
      completed: false,
    };

    setTempTodo(tempTod);
    // setIsProcessed(true);

    const todo = {
      userId: USER_ID,
      title: inputValue.trim(),
      completed: false,
    };

    todosServers.client
      .post('/todos', todo)
      .then(newPost => {
        setTodos(currentTodos => [...currentTodos, newPost as Todo]);
        setErrorMessage(ErrorMessages.None);
        setInputValue('');
        setIsAdding(true);
        setIsDisabled(false);
        setTempTodo(null);
        // setIsProcessed(false);
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.AddTodos);
        setTempTodo(null);
        // setIsProcessed(false);
        setIsDisabled(false);
        // throw err;
        setIsAdding(true);
      });
  }

  function filterTodos(status: Status) {
    if (status === 'active') {
      return [...todos].filter(tod => !tod.completed);
    } else if (status === 'completed') {
      return [...todos].filter(tod => tod.completed);
    }

    return todos;
  }

  const visibleTodos = filterTodos(filterStatus);

  const deleteTodo = (postId: number) => {
    setSelectedId(postId);

    todosServers.client
      .delete(`/todos/${postId}`)
      .then(() => {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        setTodos(todos => todos.filter(post => post.id !== postId));
        setSelectedId(null);
        setIsAdding(true);
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.DeleteTodo);
        setSelectedId(null);
        setIsAdding(true);
      });
  };

  function handleCheckedId(id: number) {
    setTodos(prevTodos =>
      prevTodos.map(todo => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed };
        }

        return todo;
      }),
    );
  }

  function handleClearComleated() {
    todos.forEach(tod => {
      if (tod.completed) {
        deleteTodo(tod.id);
      }
    });
  }
  //  #endregion

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          handleInput={handleInput}
          handleSubmitForm={handleSubmitForm}
          inputValue={inputValue}
          isDisabled={isDisabled}
          inputREf={inputREf}
        />

        <TodoList
          deleteTodo={deleteTodo}
          handleCheckedId={handleCheckedId}
          visibleTodos={visibleTodos}
          tempTodo={tempTodo}
          selectedId={selectedId}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            setFilterStatus={setFilterStatus}
            filterStatus={filterStatus}
            handleClearComleated={handleClearComleated}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <ErrorMessage errorMessage={errorMessage} />
    </div>
  );
};
