/* eslint-disable jsx-a11y/control-has-associated-label */

import { useState } from 'react';

type Props = {
  postTodo: (title: string) => void,
};

export const Header: React.FC<Props> = ({ postTodo }) => {
  const [todoTitle, setTodoTitle] = useState('');

  return (
    <header className="todoapp__header">
      <button
        title="All"
        type="button"
        className="todoapp__toggle-all active"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={(event) => {
        event.preventDefault();
        postTodo(todoTitle);
        setTodoTitle('');
      }}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={(event) => setTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
