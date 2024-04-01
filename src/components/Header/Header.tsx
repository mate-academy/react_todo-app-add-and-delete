import { AddTodoForm } from '../AddTodoForm';

export const Header: React.FC = () => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all"
        data-cy="ToggleAllButton"
      />

      <AddTodoForm />
    </header>
  );
};
