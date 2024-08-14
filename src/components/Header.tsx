import React from 'react';
import { Todo } from '../types/Todo';

import cn from 'classnames';

type Props = {
  todoData: Todo[];
  makeAllTaskAsComplited: () => void;
  makeAllTaskAsActive: () => void;
  handleSubmit: (v: React.FormEvent<HTMLFormElement>) => void;
  isInputDisable: boolean;
  autoFocusRef: React.RefObject<HTMLInputElement>;
  todoInput: string;
  setTodoInput: (v: string) => void;
};

export const Header: React.FC<Props> = ({
  todoData,
  makeAllTaskAsActive,
  makeAllTaskAsComplited,
  handleSubmit,
  isInputDisable,
  autoFocusRef,
  todoInput,
  setTodoInput,
}) => {
  const hasIncompleteTasks = todoData.some(el => !el.completed);

  return (
    <header className="todoapp__header">
      {todoData.length > 0 && (
        <button
          onClick={
            hasIncompleteTasks ? makeAllTaskAsComplited : makeAllTaskAsActive
          }
          type="button"
          className={cn('todoapp__toggle-all', { active: !hasIncompleteTasks })}
          data-cy="ToggleAllButton"
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          disabled={isInputDisable}
          ref={autoFocusRef}
          value={todoInput}
          onChange={e => setTodoInput(e.target.value)}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
