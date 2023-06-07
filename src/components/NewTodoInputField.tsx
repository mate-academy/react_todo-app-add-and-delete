/* eslint-disable jsx-a11y/control-has-associated-label */

import { useState } from 'react';

interface Props {
  hasTodos: boolean
  handleAddNewTodo: (
    event: React.FormEvent<HTMLFormElement>,
    title: string,
  ) => void

}

export default function NewTodoInputField({
  hasTodos,
  handleAddNewTodo,
}: Props) {
  const [title, setTitle] = useState('');

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    handleAddNewTodo(event, title);
    setTitle('');
  };

  return (
    <header className="todoapp__header">
      {hasTodos && <button type="button" className="todoapp__toggle-all" />}

      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
}
