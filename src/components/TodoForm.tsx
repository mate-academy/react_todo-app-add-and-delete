import React, { useState } from 'react';

import { TodosArrayType } from '../types/Todo';

type Props = {
  todos: TodosArrayType;
  addTodo: (newPostTitle: string) => Promise<boolean>;
  inputIsDisabled: boolean;
};

export default function TodoForm({ todos, addTodo, inputIsDisabled }: Props) {
  const [newPostTitle, setNewPostTitle] = useState<string>('');

  function handleTodoSubmit(e: React.FormEvent) {
    e.preventDefault();
    addTodo(newPostTitle).then(hasSucceded => {
      if (hasSucceded) {
        setNewPostTitle('');
      }
    });
  }

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={
          'todoapp__toggle-all ' +
          (todos.every(({ completed }) => completed) ? 'active' : '')
        }
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleTodoSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          id="newTodoInput"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newPostTitle}
          onChange={({ target }) => {
            setNewPostTitle(target.value);
          }}
          autoFocus
          disabled={inputIsDisabled}
        />
      </form>
    </header>
  );
}
