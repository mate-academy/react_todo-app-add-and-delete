import { AddTodoForm } from '../AddTodoFrom/AddTodoForm';

export const Header = () => (
  <header className="todoapp__header">
    <button
      type="button"
      className="todoapp__toggle-all active"
      aria-label="Toggle all"
    />

    <AddTodoForm />
  </header>
);
