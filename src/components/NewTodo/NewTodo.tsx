import React from 'react';

interface Props {
  newTodoField: React.RefObject<HTMLInputElement>,
  newTodoTitle: string,
  newTodoTitleHandler: (event: React.ChangeEvent<HTMLInputElement>) => void,
  submitNewTodoHandler: (event: React.FormEvent<HTMLFormElement>) => void,
  isAdding: boolean,
}

export const NewTodo: React.FC<Props> = ({
  newTodoField,
  newTodoTitle,
  newTodoTitleHandler,
  submitNewTodoHandler,
  isAdding,
}) => {
  return (
    <form onSubmit={(event) => submitNewTodoHandler(event)}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        disabled={isAdding}
        onChange={newTodoTitleHandler}
      />
    </form>
  );
};
