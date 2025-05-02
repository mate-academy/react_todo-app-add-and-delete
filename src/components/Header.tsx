import { Todo } from '../types/Todo';

type Props = {
  addingTodo: Todo | null;
  allCompletedTodos: boolean;
  handleSubmitForm: (evet: React.FormEvent) => void;
  inputValue: string;
  inputRef: React.RefObject<HTMLInputElement>;
  handleInputValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Header: React.FC<Props> = ({
  addingTodo,
  allCompletedTodos,
  handleSubmitForm,
  inputValue,
  inputRef,
  handleInputValue,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={`todoapp__toggle-all ${allCompletedTodos ? 'active' : ''}`}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmitForm}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={inputValue}
          onChange={handleInputValue}
          disabled={!!addingTodo}
        />
      </form>
    </header>
  );
};
