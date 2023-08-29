/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import * as todoServices from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { USER_ID } from './utils/USER_ID';
import { useTodo } from './api/useTodo';
import { Error } from './types/Error';
import { Notification } from './components/Notifiction';

export const App: React.FC = () => {
  const {
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    setCleared,
  } = useTodo();

  const [completed, active] = useMemo(() => {
    const complete = todos.filter(currentTodo => currentTodo.completed).length;

    return [
      complete,
      todos.length - complete,
    ];
  }, [todos]);

  const handleClear = () => {
    setCleared(todos
      .filter(currentTodo => currentTodo.completed)
      .map(currentTodo => currentTodo.id));
  };

  useEffect(() => {
    todoServices.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Error.Load);
      });
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader todos={todos} />

        {!!todos.length && (
          <>
            <TodoList />

            <TodoFooter
              completed={completed}
              active={active}
              handleClear={handleClear}
            />
          </>
        )}

      </div>

      <TransitionGroup>
        {!!errorMessage && (
          <CSSTransition
            timeout={500}
            classNames="error"
          >
            <Notification />
          </CSSTransition>
        )}
      </TransitionGroup>
    </div>
  );
};
