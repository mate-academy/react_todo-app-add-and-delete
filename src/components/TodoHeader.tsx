/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */

import {
  Dispatch, SetStateAction, useEffect, useRef, useState,
} from 'react';
import { Todo } from '../types/interfaces';

interface TodoHeaderProps {
  setTempTodo: Dispatch<SetStateAction<Todo | null>>
  setError: Dispatch<SetStateAction<string | null>>
  tempTodo: Todo | null
  error: string | null
}

export const TodoHeader: React.FC<TodoHeaderProps> = ({
  setTempTodo, setError, tempTodo, error,
}) => {
  const [onInput, setOnInput] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && onInput.trim()) {
      event.preventDefault();
      setIsInputDisabled(true);

      setTempTodo({
        title: onInput.trim(),
        id: 0,
        completed: false,
        userId: 82,
      });
    } else if (event.key === 'Enter' && !onInput.trim()) {
      setError('Title should not be empty');
    }
  };

  if (!tempTodo && isInputDisabled) {
    if (!error) {
      setOnInput('');
    } else {
      setOnInput(prev => prev);
    }

    setIsInputDisabled(false);
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, [onInput, error]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={onInput}
          onKeyDown={handleKeyPress}
          onChange={(event) => setOnInput(event.target.value)}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
