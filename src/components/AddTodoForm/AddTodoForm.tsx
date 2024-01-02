/* eslint-disable react/button-has-type */
import { ChangeEvent, FormEvent, useCallback } from 'react';
import { useAuthContext, useTodos } from '../../context';
import { ErrorType } from '../../types';

export const AddTodoForm = () => {
  const {
    addTodoToServer, errors, loading, setErrors, setTitle, title, todos,
  } = useTodos();
  const userId = useAuthContext();

  const autoFocus = useCallback((input: HTMLInputElement) => (
    input ? input.focus() : null
  ), [todos, errors]);

  const handleChange = (event : ChangeEvent<HTMLInputElement>) => {
    setErrors(null);

    const titleFromInput = event.target.value;

    setTitle(titleFromInput);
  };

  const newTodo = {
    userId,
    title: title.trim(),
    completed: false,
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrors(ErrorType.Title);

      return;
    }

    if (userId) {
      addTodoToServer(newTodo);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={autoFocus}
        value={title}
        disabled={loading !== null}
        onChange={handleChange}
      />
    </form>
  );
};
