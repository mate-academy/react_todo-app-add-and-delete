import React, { useState } from 'react';

import { Todo } from '../types/Todo';

type Props = {
  isTodoShow: boolean,
  newTodoTitle: string,
  handleNewTodoTitle: (
    newTodoTitle: React.ChangeEvent<HTMLInputElement>
  ) => void,
  addNewTodo: (title: string) => Promise<Todo | null>,
};

export const TodoHeader: React.FC<Props> = ({
  isTodoShow,
  newTodoTitle,
  handleNewTodoTitle,
  addNewTodo,
}) => {
  const [todoAdd, setTodoAdd] = useState(false);

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setTodoAdd(true);

    await addNewTodo(newTodoTitle);

    setTodoAdd(false);
  };

  return (
    <header className="todoapp__header">
      {isTodoShow && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          aria-label="btn"
        />
      )}

      <form onSubmit={submitForm}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={(event) => handleNewTodoTitle(event)}
          disabled={todoAdd}
        />
      </form>
    </header>
  );
};
