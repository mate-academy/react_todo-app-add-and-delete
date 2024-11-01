import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todosFromServer: Todo[];
  isAllcompleted: boolean;
  handleAllButtonClick: () => void;
  handleSubmit: (event: React.FormEvent) => void;
  todoFieldRef: React.MutableRefObject<HTMLInputElement | null>;
  inputDisabled: boolean;
  todoValue: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Header: React.FC<Props> = ({
  todosFromServer,
  isAllcompleted,
  handleAllButtonClick,
  handleSubmit,
  todoFieldRef,
  inputDisabled,
  todoValue,
  handleInputChange,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todosFromServer.length !== 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllcompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleAllButtonClick}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={todoFieldRef}
          disabled={inputDisabled}
          value={todoValue}
          onChange={handleInputChange}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
