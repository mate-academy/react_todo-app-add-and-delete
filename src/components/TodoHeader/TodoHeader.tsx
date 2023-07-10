import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  isTodosPresent: boolean;
  newTodoTitle: string
  handleNewTodoTitleChange:
  (newTitle: React.ChangeEvent<HTMLInputElement>) => void;
  addNewTodo: (title: string) => Promise<Todo | null>
}

export const TodoHeader: React.FC<Props> = (
  {
    isTodosPresent,
    newTodoTitle,
    handleNewTodoTitleChange,
    addNewTodo,
  },
) => {
  const [isAdding, setIsAdding] = useState(false);

  const formSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsAdding(true);

    await addNewTodo(newTodoTitle);

    setIsAdding(false);
  };

  return (
    <header className="todoapp__header">
      {isTodosPresent && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          aria-label="Show todos"
        />
      )}

      <form onSubmit={formSubmitHandler}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={(event) => handleNewTodoTitleChange(event)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
