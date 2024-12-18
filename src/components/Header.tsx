import React, { Dispatch, useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';
import { Errors } from '../types/Errors';

type Props = {
  onCreateTodo: ({ userId, title, completed }: Todo) => Promise<void>;
  setErrorMessage: Dispatch<React.SetStateAction<Errors>>;
  setTempTodo: (todo: Todo | null) => void;
  tempTodo: Todo | null;
  isDeleting: boolean;
  isDeletingComleted: boolean;
};

export const Header: React.FC<Props> = ({
  onCreateTodo,
  setErrorMessage,
  setTempTodo,
  tempTodo,
  isDeleting,
  isDeletingComleted,
}) => {
  const [inputTitle, setInputTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleInput.current) {
      titleInput.current.focus();
    }
  }, [tempTodo, isDeleting, isDeletingComleted]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputTitle.trim()) {
      setErrorMessage(Errors.EmptyTitle);

      return;
    }

    setIsSubmitting(true);

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: inputTitle.trim(),
      completed: false,
    };

    setTempTodo(newTodo);

    onCreateTodo(newTodo)
      .then(() => setInputTitle(''))

      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
      });
  };

  return (
    <>
      <header className="todoapp__header">
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />

        <form onSubmit={handleSubmit}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            ref={titleInput}
            value={inputTitle}
            disabled={isSubmitting}
            onChange={event => setInputTitle(event.target.value)}
          />
        </form>
      </header>
    </>
  );
};
