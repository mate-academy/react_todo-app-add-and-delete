import React from 'react';

interface Props {
  todoTitle: string;
  changeTodoTitle: (value: string) => void;
  changeError: (error: string) => void;
  addTodo: (title: string) => void;
}

export const TodoHeader: React.FC<Props> = React.memo(({
  todoTitle,
  changeTodoTitle,
  changeError,
  addTodo,
}) => {
  const handleFormOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      changeError('Title can\'t be empty');

      return;
    }

    addTodo(todoTitle);
  };

  const handleTitleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    changeTodoTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button type="button" className="todoapp__toggle-all active" />

      <form onSubmit={handleFormOnSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleTitleOnChange}
        />
      </form>
    </header>
  );
});
