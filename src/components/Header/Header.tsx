import React from 'react';

type Props = {
  hasSomeTodos: boolean,
  onAddTodo: (event: React.FormEvent) => void,
  newTodoTitle: string,
  onChangeNewTodoTitle: (title: string) => void,
  isPending: boolean,
};

export const Header: React.FC<Props> = ({
  hasSomeTodos,
  onAddTodo,
  newTodoTitle,
  onChangeNewTodoTitle,
  isPending,
}) => {
  return (
    <header className="todoapp__header">
      {hasSomeTodos && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button type="button" className="todoapp__toggle-all active" />
      )}

      <form onSubmit={onAddTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={e => onChangeNewTodoTitle(e.target.value)}
          disabled={isPending}
        />
      </form>
    </header>
  );
};
