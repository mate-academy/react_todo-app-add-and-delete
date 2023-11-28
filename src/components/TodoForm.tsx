import React, { useRef, useEffect } from 'react';
import { Todo } from '../types/Todo';
import { USER_ID } from '../helpers/userId';

type Props = {
  onSubmit: (value: Todo) => Promise<void>,
  onQuery: (value: string) => void,
  onErrorMessage: (value: string) => void,
  query: string,
  isInputDisabled: boolean,
};

export const TodoForm: React.FC<Props> = ({
  onSubmit,
  onQuery,
  onErrorMessage,
  query,
  isInputDisabled,
}) => {
  const reset = () => {
    onQuery('');
  };

  const textField = useRef<HTMLInputElement>(null);
  const pattern = /[\p{L}\p{N}\p{S}]+/gu;

  useEffect(() => {
    if (textField.current) {
      textField.current.focus();
    }
  }, [isInputDisabled]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!query || !pattern.test(query)) {
      onErrorMessage('Title should not be empty');
      setTimeout(() => {
        onErrorMessage('');
      }, 3000);

      return;
    }

    onSubmit({
      id: 0,
      userId: USER_ID,
      title: query.trim(),
      completed: false,
    }).then(reset);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={query}
        onChange={(event) => onQuery(event.target.value)}
        disabled={isInputDisabled}
        ref={textField}
      />
    </form>
  );
};
