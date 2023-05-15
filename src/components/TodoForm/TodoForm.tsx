/* eslint-disable jsx-a11y/control-has-associated-label */

import { ChangeEvent, FC, useState } from 'react';
import { Todo } from '../../types/Todo';

interface TodoFormProps {
  addTodo: (query: string) => void;
  tempTodo: Todo | null;
}

export const TodoForm: FC<TodoFormProps> = ({ addTodo, tempTodo }) => {
  const [query, setQuery] = useState('');

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmitForm = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTodo(query);
    setQuery('');
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button type="button" className="todoapp__toggle-all active" />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmitForm}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleChangeInput}
          disabled={tempTodo !== null}
        />
      </form>
    </header>
  );
};
