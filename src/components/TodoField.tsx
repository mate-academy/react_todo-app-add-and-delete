import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { ErrorTypes } from './LoadingErrorMessage';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  todos: Todo[];
  onAdd: (newTodoData: string) => void;
  todoName: string;
  setNewTodoName: (name: string) => void;
  setErrorType: (err: ErrorTypes) => void;
  isAdding: boolean;
  setErrorClosing: (er: boolean) => void;
};

export const TodoField: React.FC<Props> = ({
  todos,
  todoName,
  onAdd,
  setNewTodoName,
  setErrorType,
  isAdding,
  setErrorClosing,
  newTodoField,
}) => {
  const completedTodos = todos
    .every((todo) => todo.completed === true);

  const handleFormSubmit = (event: {
    preventDefault: () => void;
  }) => {
    event.preventDefault();
    setErrorClosing(false);

    if (!todoName.trim()) {
      setErrorType(ErrorTypes.AddingTodoError);
      setErrorClosing(false);
    }

    if (todoName.trim()) {
      onAdd(todoName);
      setErrorType(ErrorTypes.None);
    }

    setTimeout(() => newTodoField.current?.focus(), 500);
  };

  const handleInput = (event: {
    target: { value: string; };
  }) => {
    setNewTodoName(event.target.value);
  };

  return (
    <>
      {todos.length > 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames(
            ('todoapp__toggle-all'),
            { active: completedTodos },
          )}
          aria-label="Toggle"
        />
      )}

      <form
        onSubmit={handleFormSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          value={todoName}
          onChange={handleInput}
          className="todoapp__new-todo"
          placeholder="What me do?"
          disabled={isAdding}
        />
      </form>
    </>
  );
};
