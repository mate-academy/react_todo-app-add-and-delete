import React from 'react';

type Props = {
  query: string,
  handleInput: (input: string) => void,
};

export const TodoForm: React.FC<Props> = ({ query, handleInput }) => {
  return (
    <form>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={query}
        onChange={(event) => {
          handleInput(event.target.value);
        }}
      />
    </form>
  );
};
