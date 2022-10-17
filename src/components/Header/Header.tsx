import { FormEvent, FC } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  handleToggleClick: () => void;
  handleSubmit: (event: FormEvent) => void;
  newTodoField: React.RefObject<HTMLInputElement>;
  isAdding: boolean;
  title: string;
  setTitle: ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Header: FC<Props> = ({
  todos,
  handleToggleClick,
  handleSubmit,
  newTodoField,
  isAdding,
  title,
  setTitle,
}) => (
  <header className="todoapp__header">
    {todos.length > 0 && (
      <button
        data-cy="ToggleAllButton"
        type="button"
        aria-label="toggle-all"
        className="todoapp__toggle-all active"
        onClick={handleToggleClick}
      />

    )}

    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={setTitle}
        disabled={isAdding}
      />
    </form>
  </header>
);
