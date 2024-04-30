import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { useTodosContext } from '../../context/TodosProvider';

const Header = () => {
  const { todos, errorMessage, tempTodo, handleAddTodo } = useTodosContext();
  const [query, setQuery] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleAddTodo(query, setQuery);
  };

  const onChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setQuery(value);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos.length, errorMessage]);

  return (
    <>
      <header className="todoapp__header">
        {!!todos.length && (
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
            aria-label="delete"
          />
        )}

        {/* Add a todo on form submit */}
        <form onSubmit={onSubmit}>
          <input
            ref={inputRef}
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={query}
            onChange={onChange}
            disabled={!!tempTodo}
          />
        </form>
      </header>
    </>
  );
};

export default Header;
