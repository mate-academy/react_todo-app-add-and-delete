import { useState } from 'react';
import { Errors } from '../../types/Errors';

type Props = {
  onAddTodo: (title: string) => void,
  setError: (error: Errors) => void,
  isLoading: boolean,
  setLoading(bool: boolean): void,
};

export const TodoHeader: React.FC<Props> = ({
  onAddTodo,
  setError,
  isLoading,

}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!todoTitle
      || todoTitle.split(' ').filter(char => char.length !== 0).length === 0) {
      setError(Errors.EmptyTitle);
      throw new Error(Errors.EmptyTitle);
    }

    onAddTodo(todoTitle.trim());

    setTodoTitle('');
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={handleSubmit}
      >
        <input
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={(event) => setTodoTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>

  );
};
