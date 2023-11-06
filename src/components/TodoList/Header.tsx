import { useEffect, useRef, useState } from 'react';

type Props = {
  handleCreateTodoSubmit: (
    title: string,
    setDisabled: (value: boolean) => void,
    setTitle: (value: string) => void
  ) => void;
};

export const Header: React.FC<Props> = ({
  handleCreateTodoSubmit,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const createTodo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (createTodo.current) {
      createTodo.current.focus();
    }
  }, [isInputDisabled]);

  const handleCreateTodo = (event: React.FormEvent) => {
    event.preventDefault();

    handleCreateTodoSubmit(
      todoTitle,
      setIsInputDisabled,
      setTodoTitle,
    );
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        data-cy="ToggleAllButton"
        aria-label="toggle button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={handleCreateTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          disabled={isInputDisabled}
          ref={createTodo}
          onChange={event => setTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
