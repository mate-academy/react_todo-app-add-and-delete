/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useState } from 'react';
import { TodoContext } from '../context/todoContext';
import { ErrorType } from '../enums';

export const TodoHeader: React.FC = () => {
  const { loading, onErrorHandler, onAddTodo } = useContext(TodoContext);

  const [title, setTitle] = useState('');

  const handleChange = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title) {
      onErrorHandler(ErrorType.EmptyTitle);

      return;
    }

    const titleData = title;

    onAddTodo(titleData);
    setTitle('');
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button type="button" className="todoapp__toggle-all active" />

      {/* Add a todo on form submit */}
      <form onSubmit={handleChange}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          disabled={loading}
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
