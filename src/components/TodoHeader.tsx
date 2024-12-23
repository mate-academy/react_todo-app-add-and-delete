import { useEffect, useRef } from 'react';
import { Errors } from '../types/Todo';

type Props = {
  query: string;
  changeQuery: (query: string) => void;
  setTodoError: (errorMessege: string) => void;
  setSearchInput: (searchInput: React.RefObject<HTMLInputElement>) => void;
  addNewTodo: () => void;
};

export const TodoHeader: React.FC<Props> = ({
  query,
  changeQuery,
  setTodoError,
  addNewTodo,
  setSearchInput,
}) => {
  const searchInput = useRef<HTMLInputElement>(null);
  const setDisabledSearchInput = (isDisabled: boolean): void => {
    if (searchInput.current) {
      searchInput.current.disabled = isDisabled;
    }
  };

  useEffect(() => {
    setSearchInput(searchInput);
    searchInput.current?.focus();
  }, []);

  const submitHandle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query.trim() === '') {
      setTodoError(Errors.EMPTY);

      return;
    }

    setDisabledSearchInput(true);
    try {
      await addNewTodo();
      changeQuery('');
    } catch (err) {}

    setDisabledSearchInput(false);
    searchInput.current?.focus();
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={submitHandle}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={searchInput}
          value={query}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => {
            changeQuery(event.target.value);
          }}
        />
      </form>
    </header>
  );
};
