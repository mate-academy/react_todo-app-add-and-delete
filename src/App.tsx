/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';

import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { createTodo, getTodos, deleteTodo } from './api/todos';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { Main } from './components/Main/Main';
import { ErrorMessages } from './components/ErrorMessages/ErrorMessages';

const USER_ID = 10548;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('all');
  const [disableInput, setDisableInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>();
  const [hasError, setHasError] = useState(false);
  const [typeError, setTypeError] = useState('');

  async function loadedTodos(f: (USER_ID: number) => Promise<Todo[]>) {
    try {
      const result = await f(USER_ID);

      setTodos(result);
      setHasError(false);
    } catch (error) {
      setTypeError('Unable to load a todo');
      setHasError(true);
    }
  }

  useEffect(() => {
    loadedTodos(getTodos);
  }, []);

  const handleChangeInput = (event : React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleStatus = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    setStatus(event.currentTarget.type);
  };

  const handleAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDisableInput(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: input,
      completed: false,
    });

    setInput('');
    try {
      await createTodo(USER_ID, {
        title: input,
        userId: USER_ID,
        completed: false,
      });

      await loadedTodos(getTodos);
      setTempTodo(null);
      setDisableInput(false);
      setHasError(false);
    } catch (error) {
      setTypeError('Unable to add a todo');
      setHasError(true);
    }
  };

  const handleRemoveTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      loadedTodos(getTodos);
      setHasError(false);
    } catch (error) {
      setTypeError('Unable to delete a todo');
      setHasError(true);
    }
  };

  const visibleTodos = todos.filter((todo) => {
    switch (status) {
      case 'active':
        return !todo.completed;

      case 'completed':
        return !!todo.completed;

      case 'all':
      default:
        return true;
    }
  });

  (function handdleTempTodo() {
    if (tempTodo) {
      visibleTodos.push(tempTodo);
    }

    if (visibleTodos[visibleTodos.length - 1] === null) {
      visibleTodos.slice(0, -1);
    }
  }());

  const itemsLeftCount = visibleTodos.filter(todo => !todo.completed).length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          countActiveTodo={itemsLeftCount}
          inputValue={input}
          onHandleInput={handleChangeInput}
          onHandleAddTodo={handleAddTodo}
          disabeled={disableInput}
        />

        <Main
          visibleTodos={visibleTodos}
          onRemoveTodo={handleRemoveTodo}
          tempTodo={tempTodo}
        />

        {/* Hide the footer if there are no todos */}
        {!!itemsLeftCount && (
          <Footer
            selectedStatus={status}
            onHandleStatus={handleStatus}
            itemsLeftCount={itemsLeftCount}
          />
        )}

      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {hasError && <ErrorMessages typeError={typeError} />}
    </div>
  );
};
