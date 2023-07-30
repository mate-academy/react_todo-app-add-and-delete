import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  handleFormSubmit: (event: React.FormEvent) => void;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  inputValue: string;
  inputDisabled: boolean,
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  handleFormSubmit,
  setInputValue,
  inputValue,
  inputDisabled,
}) => {
  // const [error, setError] = useState<TodoErrorType>(TodoErrorType.noError);

  return (
    <header className="todoapp__header">
      {
        todos.length > 0 && (
          <button
            type="button"
            className="todoapp__toggle-all active"
            aria-label="toggle"
          />
        )
      }

      {/* Add a todo on form submit */}

      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          disabled={inputDisabled}
        />
      </form>
    </header>
  );
};
