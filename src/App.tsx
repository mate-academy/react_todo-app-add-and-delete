/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { ErrorMessage, FilteredStatus, Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import cn from 'classnames';
import { FormAddTodo } from './components/FormAddTodo';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [unableErrorMessage, setUnableErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.DEFAULT,
  );
  const [count, setCount] = useState<number>(0);
  const [filterValue, setFilterValue] = useState<FilteredStatus>(
    FilteredStatus.ALL,
  );
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [deletedTodoId, setDeletedTodoId] = useState<number[]>([]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setUnableErrorMessage(ErrorMessage.LOAD);
        setTimeout(() => {
          setUnableErrorMessage(ErrorMessage.DEFAULT);
        }, 3000);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const onHandler = () => {
    setUnableErrorMessage(ErrorMessage.DEFAULT);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setUnableErrorMessage(ErrorMessage.DEFAULT);
  };

  const handleInputChangeLater = () => {
    // Тут ви напишете логіку пізніше
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <FormAddTodo
            onSubmit={handleSubmit}
            setTodos={setTodos}
            todos={todos}
            setErrorMessage={setUnableErrorMessage}
            setTempTodo={setTempTodo}
            tempTodo={tempTodo}
            inputRef={inputRef}
          />
        </header>

        <TodoList
          todos={todos}
          setTodos={setTodos}
          setCount={setCount}
          filterValue={filterValue}
          onInputChange={handleInputChangeLater}
          tempTodo={tempTodo}
          setErrorMessage={setUnableErrorMessage}
          inputRef={inputRef}
          deletedTodoId={deletedTodoId}
          setDeletedTodoId={setDeletedTodoId}
        />

        {/* Hide the footer if there are no todos */}

        {todos.length > 0 && (
          <Footer
            count={count}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            todos={todos}
            setTodos={setTodos}
            inputRef={inputRef}
            setErrorMessage={setUnableErrorMessage}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !unableErrorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={onHandler}
        />
        {/* show only one message at a time */}
        {unableErrorMessage}
      </div>
    </div>
  );
};
