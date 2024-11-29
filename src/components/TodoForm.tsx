import React from 'react';

interface TodoFormProps {
  onAddTodo: (title: string) => void;
  newTodoTitle: string;
  setNewTodoTitle: React.Dispatch<React.SetStateAction<string>>;
  isSubmitting: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

const TodoForm: React.FC<TodoFormProps> = ({
  onAddTodo,
  newTodoTitle,
  setNewTodoTitle,
  isSubmitting,
  inputRef,
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAddTodo(newTodoTitle);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={e => setNewTodoTitle(e.target.value)}
        disabled={isSubmitting}
      />
    </form>
  );
};

export default TodoForm;
