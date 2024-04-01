import { FormEventHandler } from 'react';

interface TodoFormProps {
  addTodo: FormEventHandler;
}

export const TodoForm: React.FC<TodoFormProps> = ({ addTodo }) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={addTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          name="todo"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
