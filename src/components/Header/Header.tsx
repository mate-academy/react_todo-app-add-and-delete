import {
  ChangeEvent, FormEvent, useEffect, useRef,
} from 'react';

type Props = {
  isTodos: boolean;
  query: string;
  onQueryChange: (value: string) => void;
  onAddNewTodo: () => void;
  isAdding: boolean,
};

/* eslint-disable jsx-a11y/control-has-associated-label */
export const Header: React.FC<Props> = ({
  isTodos,
  query,
  onQueryChange,
  onAddNewTodo,
  isAdding,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isAdding]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onQueryChange(event.target.value);
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAddNewTodo();
  };

  return (
    <header className="todoapp__header">
      {isTodos
      && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className="todoapp__toggle-all active"
        />
      )}

      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleInputChange}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
