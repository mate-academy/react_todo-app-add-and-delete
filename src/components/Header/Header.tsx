import React from 'react';

type Props = {
  todosCount: number
  title: string
  setTitle: (value: string) => void
  createTodo: (newTitle:string) => void;
  setError: (error:string) => void;
  loadingTodo: number[],
};

export const Header: React.FC<Props> = ({
  todosCount,
  title,
  setTitle,
  createTodo,
  setError,
  loadingTodo,
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title.length === 0) {
      setError('Title can\'t be empty');
    }

    createTodo(title);
    setTitle('');
  };

  const handleNewTodoTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">

      {todosCount > 0 && (
        <button
          type="button"
          aria-label="button all"
          className="todoapp__toggle-all active"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleNewTodoTitle}
          disabled={!!loadingTodo.length}
        />
      </form>
    </header>
  );
};
