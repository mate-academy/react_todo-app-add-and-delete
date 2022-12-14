import React, { useCallback } from 'react';

interface Props {
  newTodoField: React.RefObject<HTMLInputElement>,
  addTodo: (title: string) => Promise<void>,
  isAdding: boolean,
  todoTitle: string,
  setTodoTitle: (text: string) => void,
}

export const NewTodo: React.FC<Props> = ({
  newTodoField,
  addTodo,
  isAdding,
  todoTitle,
  setTodoTitle,
}) => {
  const handleSubmit = useCallback((
    event: React.FormEvent,
    title: string,
  ) => {
    event.preventDefault();
    addTodo(title);
  }, []);

  return (
    <form onSubmit={(event) => handleSubmit(event, todoTitle)}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={isAdding}
        value={todoTitle}
        onChange={event => setTodoTitle(event.target.value)}
      />
    </form>
  );
};
