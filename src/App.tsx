/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  getActiveTodos,
  getCompletedTodos,
  postTodos,
  deleteTodos,
} from './api/todos';

import { Todo as TodoType } from './types/Todo';
import { Todo } from './components/Todo';
import { Filter } from './components/Filter';
import { TempTodo } from './components/TempTodo';
import { Error } from './components/Error/Error';
import { FilterParams } from './components/Filter/FilterParams';

const USER_ID = 9925;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [filterParam, setFilterParam] = useState(FilterParams.All);
  const [error, setError] = useState(false);
  const [activeTodos, setActiveTodos] = useState(0);
  const [completedTodos, setCompletedTodos] = useState(0);

  const [inputValue, setInputValue] = useState('');
  const [isGetError, setGetError] = useState(false);
  const [isPostError, setPostError] = useState(false);
  const [isDeleteError, setDeleteError] = useState(false);
  const [isInputEmpty, setEmptyInputState] = useState(false);
  const [isInputLocked, setLockInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<string | null>(null);
  const [isClearAllCompleted, setClearAllCompleted] = useState(false);

  const handleErrorState = (
    setErrorFunc: (state: boolean) => void,
    state = true,
  ) => {
    setError(state);
    setErrorFunc(state);

    let timerId: NodeJS.Timeout | null = null;

    const startTimer = () => {
      timerId = setTimeout(() => {
        handleErrorState(setErrorFunc, !state);
      }, 3000);
    };

    if (!state) {
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
    } else if (!timerId) {
      startTimer();
    }
  };

  const todosGetter = () => {
    getTodos(USER_ID)
      .then(result => setTodos(result))
      .catch(() => {
        handleErrorState(setGetError);
      });
  };

  useEffect(() => {
    todosGetter();
  }, []);

  useMemo(() => {
    getActiveTodos(USER_ID).then(result => setActiveTodos(result.length));

    getCompletedTodos(USER_ID).then(result => setCompletedTodos(result.length));
  }, [filterParam]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    const { completed } = todo;

    switch (filterParam) {
      case FilterParams.Active:
        return !completed;

      case FilterParams.Completed:
        return completed;

      default:
        return todo;
    }
  });

  const formInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;

    setInputValue(value.trim());
  };

  const postTodoToServer = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = event.nativeEvent;

    if (key === 'Enter') {
      if (!inputValue) {
        handleErrorState(setEmptyInputState);
      } else {
        setLockInput(true);
        setTempTodo(inputValue);

        postTodos(USER_ID, inputValue)
          .then(() => todosGetter())
          .catch(() => {
            handleErrorState(setPostError);
          })
          .finally(() => {
            setLockInput(false);
            setTempTodo(null);
            setInputValue('');
          });
      }
    }
  };

  const deleteAllCompleted = async () => {
    try {
      setClearAllCompleted(true);

      const arrayOfCompletedTodos
      = await getCompletedTodos(USER_ID);

      const deletePromises
      = arrayOfCompletedTodos.map(todo => deleteTodos(todo.id));

      await Promise.all(deletePromises);
      todosGetter();
    } finally {
      setClearAllCompleted(false);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button type="button" className="todoapp__toggle-all active" />

          <form onSubmit={(event) => event.preventDefault()}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={isInputLocked}
              value={inputValue}
              onChange={formInputHandler}
              onKeyDown={postTodoToServer}
            />
          </form>
        </header>

        {(!!visibleTodos.length || tempTodo) && (
          <>
            <section className="todoapp__main">
              {visibleTodos.map(todo => (
                <Todo
                  todoItem={todo}
                  setDeleteError={setDeleteError}
                  setError={setError}
                  handleErrorState={handleErrorState}
                  isClearAllCompleted={isClearAllCompleted}
                  key={todo.id}
                />
              ))}
              {tempTodo && (
                <TempTodo title={inputValue} />
              )}
            </section>
          </>
        )}

        {(!!todos.length || tempTodo) && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${activeTodos} items left`}
            </span>

            <Filter
              setFilterParam={setFilterParam}
              filterParam={filterParam}
            />

            <button
              type="button"
              className="todoapp__clear-completed"
              disabled={!completedTodos}
              onClick={deleteAllCompleted}
            >
              {!!completedTodos && 'Clear completed'}
            </button>
          </footer>
        )}
      </div>

      <Error
        error={error}
        getDataError={isGetError}
        postDataError={isPostError}
        deleteDataError={isDeleteError}
        inputState={isInputEmpty}
        handleErrorState={setError}
      />
    </div>
  );
};
