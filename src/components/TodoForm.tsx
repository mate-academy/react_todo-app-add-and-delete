import React from 'react';

export const TodoForm: React.FC = () => (
  <form>
    <input
      type="text"
      className="todoapp__new-todo"
      placeholder="What needs to be done?"
    />
  </form>
);
