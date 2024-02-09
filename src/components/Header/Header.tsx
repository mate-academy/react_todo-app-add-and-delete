import {
  useContext, useEffect, useRef, useState,
} from 'react';
import { TodosContext } from '../TodosContext';
import { ErrorMessage } from '../../types/ErrorMessage';

export const Header: React.FC = () => {
  const [title, setTitle] = useState('');
  const {
    tempTodo,
    addTodo,
    setErrorMessage,
    isSubmitting,
  } = useContext(TodosContext);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSubmitting]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const reset = () => {
    setTitle('');
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage(ErrorMessage.emptyTitle);

      return;
    }

    addTodo(title.trim())
      .then(reset);
    // setTitle('');
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        aria-label="Toggle All"
      />

      {/* Add a todo on form submit */}
      <form>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          ref={inputRef}
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              handleKeyDown(event);
            }
          }}
          disabled={!!tempTodo}
        />
      </form>
    </header>
  );
};
