import { useState, useEffect } from 'react';

type Props = {
  todoTitleRef: React.RefObject<HTMLInputElement> | null;
  onAddTodo: (title: string) => Promise<boolean>;
  isLoading: boolean;
};

export const TodoHeader: React.FC<Props> = ({
  todoTitleRef,
  onAddTodo,
  isLoading,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = todoTitle.trim();

    const success = await onAddTodo(trimmedTitle);

    if (success) {
      setTodoTitle('');
    }
  };

  useEffect(() => {
    if (!isLoading) {
      todoTitleRef?.current?.focus();
    }
  }, [todoTitleRef, isLoading]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={todoTitleRef}
          value={todoTitle}
          onChange={event => setTodoTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
