/* eslint-disable jsx-a11y/control-has-associated-label */

import { useTodo } from '../../provider/todoProvider';

export const Input = () => {
  const { addNewTodo, newTodoName, setNewTodoName } = useTodo();

  return (
    <header className="todoapp__header">
      {/* this button is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={addNewTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoName?.trimStart() || ''}
          onChange={(e) => setNewTodoName(e.target.value)}
        />
      </form>
    </header>
  );
};
