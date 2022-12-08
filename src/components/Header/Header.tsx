import React, { FormEvent, useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  setTempTodo: (todo: Todo) => void;
  setNewTodoTitle: (title: string) => void;
  newTodoTitle: string;
  isAdding: boolean;
  add: (tempTodo: Todo) => void;
};

export const Header = React.memo<Props>(({
  setTempTodo,
  setNewTodoTitle,
  newTodoTitle,
  isAdding,
  add,
}) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const tempTodo = {
      id: 0,
      userId: 5249,
      title: newTodoTitle,
      completed: false,
    };

    setTempTodo(tempTodo);

    add(tempTodo);
  };

  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
        aria-label="label"
      />

      <form onSubmit={(event) => handleSubmit(event)}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={(event) => setNewTodoTitle(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
});
