import { useEffect, useRef } from 'react';
import { useTodos } from '../../context/todoProvider';
import { addTodo } from '../../api/todos';
import { USER_ID } from '../../utils/userID';
import { ErrorType } from '../../types/Error';
import { Todo } from '../../types/Todo';

export const TodoForm = () => {
  const {
    taskName, setTaskName, error, setError, isAddingTask,
    setIsAddingTask, countIncompleteTask, setTempTodo,
    todos, setTodos,
  } = useTodos();

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos, error]);

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (taskName.trim().length === 0) {
      setError(ErrorType.title);

      return;
    }

    setIsAddingTask(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: taskName.trim(),
      completed: false,
    });

    addTodo({
      userId: USER_ID,
      title: taskName.trim(),
      completed: false,
    })
      .then((newTask: Todo) => {
        const newTodo = [...todos, newTask];

        setTodos(newTodo);
        setTaskName('');
      })
      .catch(() => setError(ErrorType.add))
      .finally(() => {
        setIsAddingTask(false);
        setTempTodo(null);
      });
  };

  return (
    <header className="todoapp__header">
      {countIncompleteTask > 0 && (
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
