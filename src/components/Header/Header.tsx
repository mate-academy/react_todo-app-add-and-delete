/* eslint-disable jsx-a11y/control-has-associated-label */
import { AddTodoForm } from '../AddTodoForm';

type Props = {
  todoTitle: string;
  handleSubmit: (event: React.FormEvent) => void;
  handleInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isActive: boolean;
  isInputDisabled: boolean;
};

export const Header: React.FC<Props> = ({
  isActive,
  todoTitle,
  handleInput,
  handleSubmit,
  isInputDisabled,
}) => {
  return (
    <header className="todoapp__header">
      {isActive && (
        <button type="button" className="todoapp__toggle-all active" />
      )}

      <AddTodoForm
        todoTitle={todoTitle}
        handleInput={handleInput}
        handleSubmit={handleSubmit}
        isInputDisabled={isInputDisabled}
      />
    </header>
  );
};
