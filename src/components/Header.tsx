import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { ErrorTypes } from '../types/ErrorTypes';

type Props = {
  isAllCompleted: boolean;
  onAddTodo: (newTodoTitle: string) => Promise<void>;
  isSubmitting: boolean;
  setErrorMessage: (error: ErrorTypes) => void;
  todosLength: number;
  inputField: React.RefObject<HTMLInputElement>;
};
export const Header: React.FC<Props> = ({
  isAllCompleted,
  onAddTodo,
  isSubmitting,
  setErrorMessage,
  todosLength,
  inputField,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (todoTitle.trim() === '') {
      setErrorMessage(ErrorTypes.Titling);

      return;
    }

    try {
      await onAddTodo(todoTitle.trim());
      setTodoTitle('');
    } catch (error) {}
  };

  useEffect(() => {
    if (inputField.current || !isSubmitting) {
      inputField?.current?.focus();
    }
  }, [inputField, todosLength, isSubmitting]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: isAllCompleted,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={onSubmit}>
        <input
          disabled={isSubmitting}
          ref={inputField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={event => setTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
