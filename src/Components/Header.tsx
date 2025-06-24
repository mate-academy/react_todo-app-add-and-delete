/* eslint-disable no-console */
import { AddTodo, Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';

interface Props {
  handle: () => void;
  handleAdd: (newTodo: AddTodo) => void;
  setErrorMessage: (args: string) => void;
  tempTodo: Todo | null;
  setInputValue: (args: string) => void;
  inputValue: string;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<Props> = ({
  handle,
  handleAdd,
  setErrorMessage,
  tempTodo,
  setInputValue,
  inputValue,
  inputRef,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmed = inputValue.trim();

    const obgData: AddTodo = {
      userId: USER_ID,
      title: trimmed,
      completed: false,
    };

    if (!trimmed) {
      setErrorMessage('Title should not be empty');

      return;
    } else {
      handleAdd(obgData);
      setErrorMessage('');
    }
  };

  return (
    <>
      <header className="todoapp__header">
        {/* this button should have `active` class only if all todos are completed */}
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
          onClick={handle}
        />

        {/* Add a todo on form submit */}
        <form onSubmit={handleSubmit}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={inputValue}
            onChange={handleChange}
            ref={inputRef}
            disabled={!!tempTodo}
          />
        </form>
      </header>
    </>
  );
};
