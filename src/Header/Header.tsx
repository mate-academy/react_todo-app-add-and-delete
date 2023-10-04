import {
  useContext,
  useEffect,
  useRef,
} from 'react';
import classNames from 'classnames';
import { TodoContext } from '../TodoContext';

export const Header = () => {
  const {
    todos,
    preparedTodos,
    title,
    setTitle,
    setTodos,
    handleSubmit,
    isTodoChange,
  } = useContext(TodoContext);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos.length, isTodoChange]);

  const handleAllCompleted = () => {
    const allCompleted = preparedTodos.every(todo => todo.completed);

    setTodos(preparedTodos.map(todo => (
      { ...todo, completed: !allCompleted }
    )));
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.find(todo => todo.completed),
          })}
          onClick={handleAllCompleted}
          data-cy="ToggleAllButton"
          aria-label="whatEver"
        />
      )}

      {/* Add a todo on form submit */}
      <form
        action="/"
        method="POST"
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          value={title}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={(event) => setTitle(event.target.value)}
          disabled={isTodoChange}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
