import {
  useContext,
  useEffect,
  useRef,
} from 'react';
import { TodosContext } from '../TodoContext/TodoContext';
import { ErrorTypes } from '../../types/ErrorTypes';

export const TodoHeader: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    isDisabled,
    todos,
    addTodo,
    setHasError,
    setTodoTitle,
    todoTitle,
  } = useContext(TodosContext);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = todoTitle.trim();

    if (!trimmedTitle) {
      setHasError(ErrorTypes.Empty);
      setTodoTitle('');

      return;
    }

    addTodo(trimmedTitle);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDisabled]);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {!!todos.length && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
          aria-label="Toggle"
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleAddTodo}>
        <input
          value={todoTitle}
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isDisabled}
          onChange={(e) => setTodoTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
