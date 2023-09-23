/* eslint-disable jsx-a11y/control-has-associated-label */

import { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  // onSubmit: (todo: Omit<Todo, 'id'>) => Promise<void>;
  onSubmit: (todo: Todo) => Promise<void>;
  todos: Todo[];
  setErrorMessage: (message: string) => void;
  userId: number;
};

export const Header: React.FC<Props> = ({
  todos,
  onSubmit,
  setErrorMessage = () => { },
  userId,
}) => {
  // #region state
  const [title, setTitle] = useState('');
  // #endregion

  // #region handlers
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  // #region reset
  const reset = () => {
    setTitle('');
    // setErrorMessage('');
  };
  // #endregion

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Title can\'t be empty');

      return;
    }

    // const id = Math.max(...todos.map(todo => todo.id)) + 1;
    const completed = false;

    onSubmit({
      id: 0, userId, title, completed,
    })
      .then(reset);
  };
  // #endregion

  // console.log(title);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className="todoapp__toggle-all"
          data-cy="ToggleAllButton"
        />
      )}

      <form
        onSubmit={handleSubmit}
      >
        <input
          onChange={handleTitleChange}
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
