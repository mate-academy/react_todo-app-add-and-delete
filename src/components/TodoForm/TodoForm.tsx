import React from 'react';

type TodoFormProps = {};

export const TodoForm: React.FC<TodoFormProps> = () => {
  return (
    <form>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        autoFocus
      />
    </form>
  );
};
