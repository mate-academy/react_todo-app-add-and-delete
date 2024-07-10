import { CreateTodoForm } from '../CreateTodoForm';

export const Header = () => (
  <header className="todoapp__header">
    {/* this button should have `active` class only if all todos are completed */}
    <button
      type="button"
      className="todoapp__toggle-all active"
      data-cy="ToggleAllButton"
    />

    <CreateTodoForm />
  </header>
);
