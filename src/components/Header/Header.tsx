import { useEffect, useRef } from 'react';
import './Header.scss';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  isShowElement: boolean;
  isFocusHeaderInput: boolean;
  handleEmptyInputError: () => void;
  inputValue: string;
  onInputChange: (event: string) => void;
  onSubmit: ({ title, completed }: Omit<Todo, 'id' | 'userId'>) => void;
  onSubmitAddTempTodo: ({ id, title, completed }: Omit<Todo, 'userId'>) => void;
  isFullTodosCompleted: boolean;
  isLoadingSpinner: boolean;
};

export const Header: React.FC<Props> = ({
  isShowElement,
  isFocusHeaderInput,
  handleEmptyInputError,
  inputValue,
  onInputChange,
  onSubmit,
  onSubmitAddTempTodo,
  isFullTodosCompleted,
  isLoadingSpinner,
}) => {
  const inputRef = useRef<HTMLInputElement>(null); // add link to ref on Input Element

  useEffect(() => {
    if (isFocusHeaderInput && inputRef) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [isFocusHeaderInput]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {isShowElement && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isFullTodosCompleted === true,
          })}
          data-cy="ToggleAllButton"
        />
      )}
      {/* Add a todo on form submit */}
      <form
        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          handleEmptyInputError();

          // send data to SERVER
          if (inputValue.trim().length !== 0) {
            // add tempTodo
            onSubmitAddTempTodo({
              id: 0,
              title: inputValue.trim(),
              completed: false,
            });
            onSubmit({ title: inputValue.trim(), completed: false });
          }
        }}
      >
        <input
          ref={inputRef}
          value={inputValue}
          disabled={isLoadingSpinner}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            onInputChange(event.target.value);
          }}
        />
      </form>
    </header>
  );
};
