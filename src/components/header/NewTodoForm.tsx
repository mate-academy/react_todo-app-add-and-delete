import React, { useEffect } from 'react';

type NewTodoFormProps = {
  onAddTodo: (title: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  loading: boolean;
};

export const NewTodoForm: React.FC<NewTodoFormProps> = ({
  onAddTodo,
  inputRef,
  loading,
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputRef.current) {
      onAddTodo(inputRef.current.value);
    }
  };

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading, inputRef]);

  return (
    <form className="new-todo-form" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={loading}
      />
    </form>
  );
};
