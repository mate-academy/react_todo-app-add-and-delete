import { useEffect, useRef } from 'react';
import { useTodos } from '../../context/todoProvider';
import { AddTodo } from '../../api/todos';
import { USER_ID } from '../../utils/userID';
import { ErrorType } from '../../types/Error';

export const TodoForm = () => {
  const {
    taskName, setTaskName, setError, isAddingTask, setIsAddingTask, count,
  } = useTodos();

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleOnSubmit = (event: any) => {
    event.preventDefault();

    if (taskName.trim().length === 0) {
      setError('Title should not be empty');

      return;
    }

    setIsAddingTask(true);

    AddTodo({
      userId: USER_ID,
      title: taskName.trim(),
      completed: false,
    })
      .then(() => setTaskName(''))
      .catch(() => setError(ErrorType.Add))
      .finally(() => {
        setIsAddingTask(false);
      });
  };

  return (
    <header className="todoapp__header">
      {count > 0 && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />
      )}
      {/* Add a todo on form submit */}
      <form onSubmit={handleOnSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={taskName}
          onChange={event => setTaskName(event.target.value)}
          ref={inputRef}
          disabled={isAddingTask}
        />
      </form>
    </header>

  );
};
