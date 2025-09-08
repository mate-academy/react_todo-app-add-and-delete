import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';

type Props = {
  onSubmit: ({ title, completed, userId }: Omit<Todo, 'id'>) => Promise<void>;
  onError: (error: string) => void;
  onErrorHidden: (errorShow: boolean) => void;
  onAddLoader: (value: boolean) => void;
  isAddLoader: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  onSubmit,
  onError,
  onErrorHidden,
  onAddLoader,
  isAddLoader,
  inputRef,
}) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!isAddLoader) {
      inputRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAddLoader]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          const cleanTitle = title.trim();

          if (cleanTitle !== '') {
            onAddLoader(true);
            onSubmit({
              title: cleanTitle,
              completed: false,
              userId: USER_ID,
            })
              .then(() => setTitle(''))
              .catch(() => {})
              .finally(() => {
                onAddLoader(false);
              });
          } else {
            onError('Title should not be empty');
            onErrorHidden(false);
          }
        }}
      >
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          autoFocus
          disabled={isAddLoader}
        />
      </form>
    </header>
  );
};
