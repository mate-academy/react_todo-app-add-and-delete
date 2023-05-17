/* eslint-disable jsx-a11y/control-has-associated-label */

import { useState } from 'react';

interface P {
  uploadNewTodo: (title: string) => void;
  setIsEmptyTitleError: (isEmpty: boolean) => void;
  isUploadingTitle: boolean;
}

export const NewTodo: React.FC<P> = ({
  uploadNewTodo,
  setIsEmptyTitleError,
  isUploadingTitle,
}) => {
  const [title, setTitle] = useState('');
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (title.trim() === '') {
      // console.log('handlesubmit', title);
      setIsEmptyTitleError(true);

      return;
    }

    uploadNewTodo(title);
    setTitle('');
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button type="button" className="todoapp__toggle-all active" />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isUploadingTitle}
        />
      </form>
    </header>
  );
};
