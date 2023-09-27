import {
  useContext, useEffect, useRef,
} from 'react';
import { TodosContext } from '../context/TodoContext';
import { ErrorType } from '../types/Errors';

export const Header = () => {
  const {
    todos,
    setNewTodoTitle,
    newTodoTitle,
    handleError,
    addTodo,
    USER_ID,
    disabledInput,
    setDisabledInput,
    // setTempTodo,
    // tempTodo,
    // setError,
  } = useContext(TodosContext);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, disabledInput]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDisabledInput(true);

    if (newTodoTitle.trim() === '') {
      handleError(ErrorType.Empty);
      setDisabledInput(false);

      return;
    }

    setNewTodoTitle(newTodoTitle.trim());

    const newTodo = {
      title: newTodoTitle,
      completed: false,
      userId: USER_ID,
    };

    addTodo(newTodo);
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {todos.length > 0
        && (
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
            title="showTodos"
            aria-label="ToggleAllButton"
          />
        )}

      <form onSubmit={handleFormSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={(event) => setNewTodoTitle(event.target.value)}
          value={newTodoTitle}
          disabled={disabledInput}
        />
      </form>
    </header>
  );
};
