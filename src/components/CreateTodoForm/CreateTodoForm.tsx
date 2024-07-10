import { useCreateTodoForm } from './useCreateTodoForm';

export const CreateTodoForm = () => {
  const { inputRef, title, isLoading, onChange, onSubmit } =
    useCreateTodoForm();

  return (
    <form onSubmit={onSubmit}>
      <input
        ref={inputRef}
        value={title}
        data-cy="NewTodoField"
        type="text"
        name="title"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        onChange={onChange}
        disabled={isLoading}
      />
    </form>
  );
};
