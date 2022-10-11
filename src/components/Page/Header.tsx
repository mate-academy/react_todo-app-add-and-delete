import classNames from 'classnames';
import { FormEvent } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  toggleAllActive: boolean;
  handleClickToggle: () => void;
  handleSubmit: (event: FormEvent) => Promise<void>;
  newTodoField: React.RefObject<HTMLInputElement>;
  title: string;
  handleChangeInput: ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => void;
  isAdding: boolean;
};

export const Header: React.FC<Props> = ({
  todos,
  toggleAllActive,
  handleClickToggle,
  handleSubmit,
  newTodoField,
  title,
  handleChangeInput,
  isAdding,
}) => (
  <header className="todoapp__header">
    {todos.length > 0 && (
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: toggleAllActive },
        )}
        onClick={handleClickToggle}
      >
        {null}
      </button>
    )}

    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={handleChangeInput}
        disabled={isAdding}
        /// <reference path="newTodoField" />

      />
    </form>
  </header>
);
