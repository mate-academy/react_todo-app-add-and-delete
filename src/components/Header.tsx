import { NewTodoField } from './NewTodoField';

export const Header: React.FC = () => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <NewTodoField />
    </header>
  );
};
