import { ErrorMessage, ERROR_MESSAGES } from '../../types/ErrorMessages';
import React, { useState } from 'react';
import { addTodos, USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo';

type HeaderProps = {
  onErrorMessage: (errorMessage: ErrorMessage) => void;
  onSetTempTodo: (todo: Todo | null) => void;
  onSetTodo: React.Dispatch<React.SetStateAction<Todo[]>>;
  setProcessingIds: React.Dispatch<React.SetStateAction<number[]>>;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
};

export const Header = ({
  onErrorMessage,
  onSetTempTodo,
  onSetTodo,
  setProcessingIds,
  inputRef,
}: HeaderProps) => {
  const [titleValue, setTitleValue] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const normalizedTitle = titleValue.trim();

    if (!normalizedTitle) {
      onErrorMessage(ERROR_MESSAGES.EMPTY_TITLE);

      return;
    }

    onSetTempTodo({
      id: 0,
      userId: USER_ID,
      title: normalizedTitle,
      completed: false,
    });
    setProcessingIds(prevIds => [...prevIds, 0]);
    setIsSubmitting(true);
    addTodos(normalizedTitle)
      .then(todo => {
        onSetTodo(todos => [...todos, todo]);
        setTitleValue('');
      })
      .catch(() => {
        onErrorMessage(ERROR_MESSAGES.ADD_FAIL);
      })
      .finally(() => {
        setIsSubmitting(false);
        onSetTempTodo(null);
        setProcessingIds(prevIds => prevIds.filter(id => id !== 0));
        setTimeout(() => inputRef.current?.focus());
      });
  }

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={titleValue}
          onChange={e => setTitleValue(e.target.value)}
          disabled={isSubmitting}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
