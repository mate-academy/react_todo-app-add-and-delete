/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { USER_ID, getTodos } from '../api/todos';
import { UserWarning } from '../UserWarning';
import { Header } from './Header';
import { TodoList } from './TodoList';
import { Footer } from './Footer';
import { SetTodosContext, TodosContext } from '../Contexts/TodosContext';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';
import { ErrorContext, SetErrorContext } from '../Contexts/ErrorContext';
import { ErrorMessage } from '../types/Error';
import { SetInputRef } from '../Contexts/InputRefContext';

export const TodoApp: React.FC = () => {
  const todos = useContext(TodosContext);
  const setTodos = useContext(SetTodosContext);
  const errorMessage = useContext(ErrorContext);
  const setErrorMessage = useContext(SetErrorContext);
  const setInputFocused = useContext(SetInputRef);

  const [filter, setFilter] = useState(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    if (errorMessage !== ErrorMessage.noError) {
      setTimeout(() => setErrorMessage(ErrorMessage.noError), 3000);
    }
  }, [errorMessage, setErrorMessage]);

  const preparedTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case Filter.All:
          return todo;
        case Filter.Active:
          return !todo.completed;
        case Filter.Completed:
          return todo.completed;
        default:
          return todo;
      }
    });
  }, [filter, todos]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.load);
      })
      .finally(() => setInputFocused(true));
  }, [setTodos, setErrorMessage, setInputFocused]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleErrorDelete = () => {
    setErrorMessage(ErrorMessage.noError);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header setTempTodo={setTempTodo} />

        <TodoList todos={preparedTodos} tempTodo={tempTodo} />

        {todos.length !== 0 && <Footer setFilter={setFilter} filter={filter} />}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleErrorDelete}
        />
        {errorMessage}
      </div>
    </div>
  );
};
