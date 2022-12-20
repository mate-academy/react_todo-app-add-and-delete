import React from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>,
};

export const NewTodoField: React.FC<Props> = ({
  newTodoField,
}) => {
  return (
    <form>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
      />
    </form>
  );
};
