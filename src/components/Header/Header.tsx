import React from 'react';
import cn from 'classnames';

type Props = {
  isAllTodoDone: boolean;
  isCreatingTodo: boolean;
  refQuery: React.Ref<HTMLInputElement>;
  onSubmitTodo: (event: React.FormEvent<HTMLFormElement>) => void;
  onToggleAllTodo: () => void;
};

export const Header: React.FC<Props> = ({
  refQuery,
  isAllTodoDone,
  isCreatingTodo,
  onSubmitTodo,
  onToggleAllTodo,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: isAllTodoDone })}
        onClick={onToggleAllTodo}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmitTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isCreatingTodo}
          ref={refQuery}
        />
      </form>
    </header>
  );
};
