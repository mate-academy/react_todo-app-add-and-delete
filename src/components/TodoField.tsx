import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  newToField: React.RefObject<HTMLInputElement>;
  todos: Todo[];
  onAdd: (newTodoData: string) => void;
  todoName: string;
  setNewTodoName: (name: string) => void;
  setAddingBlancError: (error: boolean) => void;
  isAdding: boolean;
  loadingError: boolean;
  setErrorClosing: (er: boolean) => void;
};

export const TodoField: React.FC<Props> = ({
  todos, todoName, onAdd, setNewTodoName, setAddingBlancError, isAdding,
  loadingError, setErrorClosing, newToField,
}) => {
  const completedTodos = todos.every((todo) => todo.completed === true);

  const handleFormSubmit = (event: {
    preventDefault: () => void;
  }) => {
    event.preventDefault();

    if (!todoName.trim()) {
      setAddingBlancError(true);
      setErrorClosing(false);
    }

    if (todoName.trim()) {
      onAdd(todoName);
      setAddingBlancError(false);
    }

    setTimeout(() => newToField.current?.focus(), 500);
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
          disabled={isAdding || loadingError}
          className="todoapp__new-todo"
          placeholder="What me do?"
          ref={newToField}
          value={todoName}
          onChange={handleInput}
        />
      </form>
    </>
  );
};
