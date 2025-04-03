import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  onAdd: (title: string) => void;
  toggleAllTodos: (newCompleted: boolean) => void;
  todos: Todo[];
};

export const Header: React.FC<Props> = ({ onAdd, toggleAllTodos, todos }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef?.current?.focus();
  }, [todos]);

  const [title, setTitle] = useState<string>('');
  const [toggleAll, setToggleAll] = useState<boolean>(true);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', { active: toggleAll })}
        data-cy="ToggleAllButton"
        onClick={() => {
          setToggleAll(toggle => !toggle);
          toggleAllTodos(toggleAll);
        }}
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={async event => {
          event.preventDefault();
          await onAdd(title);
          setTitle('');
        }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={inputRef}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
