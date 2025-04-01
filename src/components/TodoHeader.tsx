import { useEffect, useRef } from 'react';
import { USER_ID } from '../api/todos';

type Props = {
  isInput: string;
  setIsInput: React.Dispatch<React.SetStateAction<string>>;
  createTodo: (userId: number, title: string, completed: boolean) => void;
  setErrorType: (errorType: string | null) => void;
  handleError: (errorType: string | null) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
};
export const TodoHeader: React.FC<Props> = ({
  isInput,
  setIsInput,
  createTodo,
  setErrorType,
  handleError,
  isLoading,
  setIsLoading,
}) => {
  const titleFocus = useRef(null);

  useEffect(() => {
    titleFocus.current.focus();
  }, [createTodo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isInput.trim() === '') {
      handleError('Title should not be empty');

      return;
    }

    setIsLoading(true);
    createTodo(USER_ID, isInput.trim(), false)
      .then(() => {
        setIsInput('');
      })
      .catch(() => {
        handleError('Unable to add a todo');
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        onClick={() => {}}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          disabled={isLoading}
          ref={titleFocus}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={isInput}
          onChange={event => {
            setIsInput(event.target.value);
            setErrorType(null);
          }}
        />
      </form>
    </header>
  );
};
