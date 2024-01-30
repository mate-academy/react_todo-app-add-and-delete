/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { Todo, USER_ID } from '../types/Todo';
import { createTodo } from '../api/todos';
import { ErrorTp } from '../types/error';

type Props = {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  todos: Todo[] | [];
};

export const Header: React.FC<Props> = ({ setTodos, todos }) => {
  const [title, setTitle] = useState('');

  function addPost() {
    if (title.trim() === '') {
      return ErrorTp.add__todo;
    }

    createTodo({
      title,
      completed: false,
      userId: USER_ID,
    })
      .then(newTodo => {
        setTodos([...todos, newTodo]);
        setTitle('');
      })
      .catch(() => ErrorTp.load_error);

    return ErrorTp === null;
  }

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addPost();
        }}
      >
        <input
          onChange={e => setTitle(e.target.value)}
          value={title}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
