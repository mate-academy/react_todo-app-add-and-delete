import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { USER_ID } from '../utils/User_Id';

type Props = {
  todos: Todo[],
  setErrorMessage: (error: string) => void,
  onSubmit: (todo: Todo) => Promise<{ isError: boolean } | undefined>,
  setIsDisabledInput: (isDisable: boolean) => void,
  isDisabledInput: boolean,
  errorDeletion: () => void,
};

export const Header: React.FC<Props> = ({
  todos,
  setErrorMessage,
  onSubmit,
  setIsDisabledInput,
  isDisabledInput,
  errorDeletion,
}) => {
  const [title, setTitle] = useState('');

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current?.focus();
    }
  }, [todos, onSubmit]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setErrorMessage('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event?.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Title should not be empty');

      errorDeletion();

      return;
    }

    if (!title) {
      return;
    }

    const resultOfSubmit = await onSubmit({
      title: title.trim(),
      userId: USER_ID,
      completed: false,
      id: 0,
    });

    if (!resultOfSubmit?.isError) {
      setTitle('');
    }

    setIsDisabledInput(false);
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {todos.length > 0 && (
        /* eslint-disable-next-line jsx-a11y/control-has-associated-label */
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={titleField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleTitleChange}
          value={title}
          disabled={isDisabledInput}
        />
      </form>
    </header>
  );
};
