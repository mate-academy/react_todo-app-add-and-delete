import classNames from 'classnames';
import { useEffect } from 'react';

type Props = {
  allTodosCompleted: boolean;
  onAdd: (value: string) => Promise<void>;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  allTodosCompleted,
  onAdd,
  inputRef,
}) => {
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const inputElement = inputRef.current;

    if (inputElement) {
      inputElement.disabled = true;

      onAdd(inputElement.value)
        .then(() => {
          if (inputElement) {
            inputElement.value = '';
          }
        })
        .catch(() => {})
        .finally(() => {
          if (inputElement) {
            inputElement.disabled = false;
            inputElement.focus();
          }
        });
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: allTodosCompleted,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
        />
      </form>
    </header>
  );
};
