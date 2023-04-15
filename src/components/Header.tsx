import { FormEvent, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  addTodo: (title: string) => void,
  isInputDisabled: boolean,
};

export const Header: React.FC<Props> = ({
  todos,
  addTodo,
  isInputDisabled,
}) => {
  const [title, setTitle] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTodo(title);
    setTitle('');
  };

  return (
    <header className="todoapp__header">

      {todos.length > 0 && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          aria-label="active"
        />
      )}

      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isInputDisabled}
          value={title}
          onChange={handleInputChange}
        />
      </form>
    </header>
  );
};
