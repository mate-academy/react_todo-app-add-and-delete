import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { LegacyRef } from 'react';

type Props = {
  todos: Todo[];
  value: string;
  inputDisabled: boolean;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  inputRef: LegacyRef<HTMLInputElement>;
  setValue: (value: string) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  value,
  inputDisabled,
  handleSubmit,
  inputRef,
  setValue,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.length > 0 && todos.every(todo => todo.completed),
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
          value={value}
          onChange={event => setValue(event.target.value)}
          disabled={inputDisabled}
        />
      </form>
    </header>
  );
};
