import { NewTodo } from './NewTodo';

/* eslint-disable jsx-a11y/control-has-associated-label */
interface HeaderProps {
  hasActive: boolean
  todoText: string;
  handleChangeTodoText: (event:React.ChangeEvent<HTMLInputElement>) => void;
  handleNewTodoSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleDisableInput: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  hasActive,
  todoText,
  handleChangeTodoText,
  handleNewTodoSubmit,
  handleDisableInput,
}) => {
  return (
    <header className="todoapp__header">
      {hasActive
          && <button type="button" className="todoapp__toggle-all active" />}
      <NewTodo
        handleChangeTodoText={handleChangeTodoText}
        todoText={todoText}
        handleNewTodoSubmit={handleNewTodoSubmit}
        isInputDisabled={handleDisableInput}
      />
    </header>
  );
};
