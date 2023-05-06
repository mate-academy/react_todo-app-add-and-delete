import React, { KeyboardEventHandler } from 'react';
import classnames from 'classnames';

interface Props {
  activeTodos: number
  title: string
  isProcessed: boolean
  onAddTitle: (value: string) => void
  onAddTodo: KeyboardEventHandler<HTMLInputElement>
}

export const TodoHeader: React.FC<Props> = ({
  activeTodos, title, onAddTitle, isProcessed, onAddTodo,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classnames(
          'todoapp__toggle-all',
          { active: !activeTodos },
        )}
        aria-label="button-toggle-all"
      />

      <form>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => onAddTitle(event.target.value)}
          onKeyUp={onAddTodo}
          disabled={isProcessed}
        />
      </form>
    </header>
  );
};
