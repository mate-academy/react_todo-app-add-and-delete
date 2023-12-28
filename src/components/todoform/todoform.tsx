import { useTodos } from '../../context/todoProvider';

export const TodoForm = () => {
  const { taskName, setTaskName } = useTodos();

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {/* <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      /> */}

      {/* Add a todo on form submit */}
      <form>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={taskName}
          onChange={event => setTaskName(event.target.value)}
        />
      </form>
    </header>

  );
};
