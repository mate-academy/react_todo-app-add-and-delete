/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import cn from 'classnames';

import {
  UNABLE_LOAD_ERROR,
  UNABLE_TO_ADD_ERROR,
  UNABLE_TO_DELETE_ERROR,
} from './constants/errordata';
import { USER_ID } from './constants/userdata';
import { UserWarning } from './components/UserWarning/UserWarning';
import { createTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { Status } from './types/Status';
import { wait } from './utils/fetchClient';
import { getFilteredTodos } from './utils/getFilteredTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [status, setStatus] = useState<Status>(Status.All);
  const [errorMessage, setErrorMessage] = useState('');
  const filteredTodos = getFilteredTodos(todos, status);

  const itemsLeft = todos.filter(({ completed }) => {
    return !completed;
  }).length;

  const itemsCompleted = todos.filter(({ completed }) => {
    return completed;
  }).length;

  const createTodoHandler = async (newTodo: Omit<Todo, 'id'>) => {
    setTempTodo({ ...newTodo, id: 0 });

    createTodo(newTodo)
      .then(createdTodo => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setInputText('');
      })
      .catch(() => {
        setErrorMessage(UNABLE_TO_ADD_ERROR);

        wait(3000).then(() => setErrorMessage(''));
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleDeteleTodo = (deletedId: number) => {
    deleteTodo(deletedId)
      .then(() => {
        setTodos((currentTodos: Todo[]) =>
          currentTodos.filter(todo => todo.id !== deletedId),
        );
      })
      .catch(() => {
        wait(3000).then(() => setErrorMessage(UNABLE_TO_DELETE_ERROR));
      });
  };

  const removeHandleDeleteTodo = () => {
    const completedTodos = todos.filter(({ completed }) => completed);
    const activeTodos = todos.filter(({ completed }) => !completed);

    completedTodos.forEach(({ id }) => handleDeteleTodo(id));
    setTodos(activeTodos);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(UNABLE_LOAD_ERROR);

        return wait(3000).then(() => setErrorMessage(''));
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          tempTodo={tempTodo}
          inputText={inputText}
          setInputText={setInputText}
          setErrorMessage={setErrorMessage}
          createTodoHandler={createTodoHandler}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              handleDeteleTodo={handleDeteleTodo}
            />
            <Footer
              itemsLeft={itemsLeft}
              itemsCompleted={itemsCompleted}
              currentStatus={status}
              setStatus={setStatus}
              removeHandleDeleteTodo={removeHandleDeleteTodo}
            />
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
