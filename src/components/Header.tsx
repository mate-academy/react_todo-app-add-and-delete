import React, { useContext, useEffect, useRef, useState } from 'react';
import { TodoContext } from '../context/TodoContext';
import { Error } from '../types/ErrorMessage';
import * as TodoService from '../api/todos';
import { USER_ID } from '../types/userId';

export const Header: React.FC = () => {
  const [newTitle, setNewTitle] = useState('');
  const [disableInput, setDisableInput] = useState(false);

  const { todos, tempTodo, addTodo, handleSetTempTodo, handleSetErrorMessage } =
    useContext(TodoContext);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos.length, tempTodo]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSetErrorMessage(Error.none);

    const newTodo = {
      title: newTitle.trim(),
      userId: USER_ID,
      completed: false,
    };

    if (!newTitle.trim()) {
      handleSetErrorMessage(Error.emptyTitle);
    }

    setDisableInput(true);

    handleSetTempTodo({ ...newTodo, id: 0 });
    TodoService.addTodo(newTodo)
      .then(todo => {
        addTodo(todo);
        setNewTitle('');
      })
      .catch(() => handleSetErrorMessage(Error.addTodo))
      .finally(() => {
        setDisableInput(false);
        handleSetTempTodo(null);
      });
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        aria-label="toggle"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          disabled={disableInput}
        />
      </form>
    </header>
  );
};
