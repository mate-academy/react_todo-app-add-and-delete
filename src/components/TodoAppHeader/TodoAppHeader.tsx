import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../utils/errorMessages';

type Props = {
  todos: Todo[];
  onTodoAdd: (todoTitle: string) => Promise<void>;
  setErrorMessage: (value: ErrorMessage) => void;
  isRequesting: boolean,
};

export const TodoAppHeader: React.FC<Props> = ({
  todos,
  onTodoAdd,
  setErrorMessage,
  isRequesting,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const inputFocus = useRef<HTMLInputElement | null>(null);

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (todoTitle.trim().length === 0) {
      setErrorMessage(ErrorMessage.Title);

      return;
    }

    onTodoAdd(todoTitle.trim())
      .then(() => {
        setTodoTitle('');
      });
  };

  useEffect(() => {
    if (inputFocus.current) {
      inputFocus.current.focus();
    }
  }, [todos]);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {Boolean(todos.length) && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form
        onSubmit={onFormSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputFocus}
          value={todoTitle}
          onChange={onTitleChange}
          disabled={isRequesting}
        />
      </form>
    </header>
  );
};
