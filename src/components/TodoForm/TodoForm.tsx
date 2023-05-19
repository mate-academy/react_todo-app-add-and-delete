/* eslint-disable jsx-a11y/control-has-associated-label */

import { ChangeEvent, FC, useState } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  onAdd: (query: string) => void;
  todo: Todo | null;
}

export const TodoForm: FC<Props> = ({ onAdd, todo }) => {
  const [query, setQuery] = useState('');

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmitForm = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAdd(query);
    setQuery('');
  };

  return (
    <header className="todoapp__header">
      <button type="button" className="todoapp__toggle-all active" />

      <form onSubmit={handleSubmitForm}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleChangeInput}
          disabled={!!todo}
        />
      </form>
    </header>
  );
};
