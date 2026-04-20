import classNames from 'classnames';
import React from 'react';

type Props = {
  isEveryCompletedTodo: boolean;
  headerInputRef: React.MutableRefObject<HTMLInputElement | null>;
  title: string;
  setTitle: (title: string) => void;
  addTodo: (title: string) => Promise<void>;
  disabledInput: boolean;
};

const HeaderComponent: React.FC<Props> = ({
  isEveryCompletedTodo,
  headerInputRef,
  title,
  setTitle,
  addTodo,
  disabledInput,
}) => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTodo(title);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: isEveryCompletedTodo,
        })}
        data-cy="ToggleAllButton"
      />
      <form onSubmit={handleSubmit}>
        <input
          ref={headerInputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={disabledInput}
          value={title}
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};

export const Header = React.memo(HeaderComponent);
