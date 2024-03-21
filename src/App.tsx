/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { UserWarning } from './UserWarning';
import { USER_ID, createTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { Filter } from './types/Filter';
import { wait } from './utils/fetchClient';
import { getFilteredTodos } from './helper/getFilteredTodos';
import * as errors from './Errors/Errors';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const filteredTodos = getFilteredTodos(todos, filter);

  const [inputValue, setInputValue] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);
  const [addTodoId, setAddTodoId] = useState<number | null>(null);

  const titleField = useRef<HTMLInputElement>(null);

  const activeItems = todos.filter(({ completed }) => {
    return !completed;
  }).length;

  const completedItems = todos.filter(({ completed }) => {
    return completed;
  }).length;

  const createTodoHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputValue.trim().length === 0) {
      setErrorMessage(errors.TITLE_EMPTY);

      wait(3000).then(() => setErrorMessage(''));

      return;
    }

    setLoading(true);
    setAddTodoId(0);

    setTempTodo({
      id: 0,
      title: inputValue.trim(),
      completed: false,
      userId: USER_ID,
    });

    const newTodo = {
      title: inputValue.trim(),
      completed: false,
      userId: USER_ID,
    };

    createTodo(newTodo)
      .then(todo => {
        setTodos(prevTodos => [...prevTodos, todo]);
        setInputValue('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');

        return wait(3000).then(() => setErrorMessage(''));
      })
      .finally(() => {
        setLoading(false);
        setAddTodoId(null);
        setTempTodo(null);
      });
  };

  const deleteTodoHandler = (targetId: number) => {
    setLoading(true);
    setAddTodoId(targetId);

    deleteTodo(targetId)
      .then(() => {
        setTodos((currentTodos: Todo[]) =>
          currentTodos.filter(item => item.id !== targetId),
        );
      })
      .catch(() => {
        setErrorMessage(errors.UNABLE_TO_DELETE);
        setAddTodoId(null);

        wait(3000).then(() => setErrorMessage(''));
      })
      .finally(() => {
        setLoading(false);
        setAddTodoId(null);
      });
  };

  const deletedCheckedTodoHandler = () => {
    const completedTodos = todos.filter(({ completed }) => completed);

    completedTodos.forEach(({ id }) => deleteTodoHandler(id));
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(errors.UNABLE_TO_LOAD);

        wait(3000).then(() => setErrorMessage(''));
      });
  }, []);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [tempTodo, todos]);

  const errorHandler = () => {
    setErrorMessage('');
  };

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
          onSubmit={createTodoHandler}
          loading={loading}
          titleField={titleField}
        />

        {!!todos.length && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              addTodoId={addTodoId}
              deleteTodoHandler={deleteTodoHandler}
            />

            <Footer
              activeItems={activeItems}
              currentFilter={filter}
              setFilter={setFilter}
              completedItems={completedItems}
              deletedCheckedTodoHandler={deletedCheckedTodoHandler}
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
          onClick={errorHandler}
        />
        {errorMessage}
      </div>
    </div>
  );
};
