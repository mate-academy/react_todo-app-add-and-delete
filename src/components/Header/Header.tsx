import { useContext } from 'react';
import { TodoContext } from '../../TodoContext';

export const Header: React.FC = () => {
  const { title, setTitle, handleSubmit, titleField, isFormDisabled } =
    useContext(TodoContext);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={titleField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          disabled={isFormDisabled}
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
