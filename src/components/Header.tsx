import { ErrorType } from '../types/ErrorType';
import { NewTodoInput } from './NewTodoInput';

interface Props {
  isAddingTodo: boolean;
  handleAddTodo: (title: string) => Promise<void>;
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorType | null>>;
  focusTrigger: number;
}

export const Header: React.FC<Props> = ({
  isAddingTodo,
  handleAddTodo,
  setErrorMessage,
  focusTrigger,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <NewTodoInput
        onSubmit={handleAddTodo}
        isDisabled={isAddingTodo}
        setErrorMessage={setErrorMessage}
        focusTrigger={focusTrigger}
      />
    </header>
  );
};
