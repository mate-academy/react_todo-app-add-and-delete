import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { addTodo } from '../../utils/addTodo';

type HeaderProps = {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setTempTodo: Dispatch<SetStateAction<Todo | null>>;
  setError: Dispatch<SetStateAction<string>>;
  isLoadingId: number | null;
  setisLoadingId: Dispatch<SetStateAction<number | null>>;
};

export const Header: React.FC<HeaderProps> = ({
  todos,
  setTodos,
  setTempTodo,
  setError,
  isLoadingId,
  setisLoadingId,
}) => {
  const [inputValue, setInputValue] = useState('');

  const titleInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleInput.current?.focus();
  }, [todos]);

  function handleAddTodo(event: React.FormEvent) {
    event.preventDefault();
    addTodo(
      inputValue,
      setError,
      setisLoadingId,
      setTempTodo,
      setTodos,
      setInputValue,
    );
  }

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleAddTodo}>
        <input
          ref={titleInput}
          disabled={isLoadingId !== null}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
        />
      </form>
    </header>
  );
};
