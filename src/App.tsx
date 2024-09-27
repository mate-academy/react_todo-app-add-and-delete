/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import cn from 'classnames';

import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { Filter } from './types/Filter';
import { wait } from './utils/fetchClient';
import { getFilteredTodos } from './helpers/getFilteredTodos';
import {
  UNABLE_LOAD_ERROR,
  UNABLE_TO_ADD_ERROR,
  UNABLE_TO_DELETE_ERROR,
} from './constants/errors';
import { USER_ID } from './constants/credentials';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const filteredTodos = getFilteredTodos(todos, filter);

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
        setTodos((currentTodos: Todo[]) => [...currentTodos, createdTodo]);
        setInputValue('');
      })
      .catch(() => {
        setErrorMessage(UNABLE_TO_ADD_ERROR);

        wait(3000).then(() => setErrorMessage(''));
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const deleteTodoHandler = (targetId: number) => {
    deleteTodo(targetId)
      .then(() => {
        setTodos((currentTodos: Todo[]) =>
          currentTodos.filter(item => item.id !== targetId),
        );
      })
      .catch(() => {
        wait(3000).then(() => setErrorMessage(UNABLE_TO_DELETE_ERROR));
      });
  };

  const deleteCompletedTodosHandler = () => {
    const completedTodos = todos.filter(({ completed }) => completed);
    const activeTodos = todos.filter(({ completed }) => !completed);

    completedTodos.forEach(({ id }) => deleteTodoHandler(id));
    setTodos(activeTodos);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(UNABLE_LOAD_ERROR);

        wait(3000).then(() => setErrorMessage(''));
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
          inputValue={inputValue}
          setInputValue={setInputValue}
          createTodoHandler={createTodoHandler}
          setErrorMessage={setErrorMessage}
        />
        {!!todos.length && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              deleteTodoHandler={deleteTodoHandler}
            />
            <Footer
              itemsLeft={itemsLeft}
              currentFilter={filter}
              setFilter={setFilter}
              itemsCompleted={itemsCompleted}
              deleteCompletedTodosHandler={deleteCompletedTodosHandler}
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
