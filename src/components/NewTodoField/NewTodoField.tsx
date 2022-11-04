import { ErrorType } from '../../types/ErrorType';

type Props = {
  onError: (errorType: ErrorType) => void;
  onAddTodo: (event: React.FormEvent<HTMLFormElement>) => void;
  isAdding: boolean;
  hasTodos: boolean;
  newTodoField: React.RefObject<HTMLInputElement>;
  newTodoTitle: string;
  onTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const NewTodoField: React.FC<Props> = ({
  onError,
  onAddTodo,
  isAdding,
  hasTodos,
  newTodoField,
  newTodoTitle,
  onTitleChange,
}) => {
  return (
    <header className="todoapp__header">
      {hasTodos && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          data-cy="ToggleAllButton"
          type="button"
          className="todoapp__toggle-all active"
          onClick={() => onError(ErrorType.UPDATE)}
        />
      )}

      <form onSubmit={onAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          disabled={isAdding}
          value={newTodoTitle}
          placeholder="What needs to be done?"
          onFocus={() => onError(ErrorType.NONE)}
          onChange={(event) => onTitleChange(event)}
        />
      </form>
    </header>
  );
};
