import { NewTodo } from '../NewTodo/NewTodo';

interface HeaderProps {
  hasActiveTodos: boolean,
  newTodo: string,
  inputDisabled: boolean,
  setNewTodo(event: React.ChangeEvent<HTMLInputElement>): void,
  onNewTodoSubmit(event: React.FormEvent<HTMLFormElement>): void,
}

/* this buttons is active only if there are some active todos  */
export const Header: React.FC<HeaderProps> = ({
  hasActiveTodos,
  newTodo,
  inputDisabled,
  setNewTodo,
  onNewTodoSubmit,
}) => {
  return (
    <header className="todoapp__header">
      {hasActiveTodos && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          aria-label="button"
        />
      )}
      <NewTodo
        newTodo={newTodo}
        setNewTodo={setNewTodo}
        inputDisabled={inputDisabled}
        onNewTodoSubmit={onNewTodoSubmit}
      />
    </header>
  );
};
