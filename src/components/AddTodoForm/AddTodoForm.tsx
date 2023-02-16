import React from 'react';

type Props = {
  setQuery: (value: string) => void,
  query: string,
  handleFormSubmit: () => void,
};

export const AddTodoForm: React.FC<Props> = (
  {
    setQuery,
    query,
    handleFormSubmit,
  },
) => {
  const isFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleFormSubmit();
  };

  return (
    <form
      onSubmit={(event) => {
        isFormSubmit(event);
      }}
    >
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
        }}
      />
      <input type="submit" hidden />
    </form>
  );
};
