import { NewTodo } from './NewTodo';

/* eslint-disable jsx-a11y/control-has-associated-label */
interface HeaderProps {
  hasActiveTodos: boolean
  todoText: string;
  onTodoTextChange: (event:React.ChangeEvent<HTMLInputElement>) => void;
  onNewTodoSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isInputDisabled: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  hasActiveTodos,
  todoText,
  onTodoTextChange,
  onNewTodoSubmit,
  isInputDisabled,
}) => {
  return (
    <header className="todoapp__header">
      {hasActiveTodos
          && <button type="button" className="todoapp__toggle-all active" />}
      <NewTodo
        onTodoTextChange={onTodoTextChange}
        todoText={todoText}
        onNewTodoSubmit={onNewTodoSubmit}
        isInputDisabled={isInputDisabled}
      />
    </header>
  );
};
