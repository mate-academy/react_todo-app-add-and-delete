import React from 'react';

type NewTodoFormProps = {
  onAddTodo: (title: string) => void;
  isAdding: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const NewTodoForm: React.FC<NewTodoFormProps> = ({
  onAddTodo,
  isAdding,
  inputRef,
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputRef.current) {
      onAddTodo(inputRef.current.value);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={isAdding}
        autoFocus
      />
    </form>
  );
};
