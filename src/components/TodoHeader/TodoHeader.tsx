import React, {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';

type Props = {
  isAnyTodoActive: boolean,
  isNewLoading: boolean,
  handleSubmit: (
    event: FormEvent<HTMLFormElement>,
    title: string,
    setTitle: Dispatch<SetStateAction<string>>,
    inputRef: React.RefObject<HTMLInputElement>,
  ) => void,
};

export const TodoHeader: React.FC<Props> = ({
  isAnyTodoActive,
  isNewLoading,
  handleSubmit,
}) => {
  const [newTodoText, setNewTodoText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && !inputRef.current.disabled) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      <button
        aria-label="ToggleAllButton"
        type="button"
        className={cn('todoapp__toggle-all', {
          active: !isAnyTodoActive,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={(event) => handleSubmit(
        event,
        newTodoText,
        setNewTodoText,
        inputRef,
      )}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoText}
          onChange={(event) => setNewTodoText(event.target.value)}
          disabled={isNewLoading}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
