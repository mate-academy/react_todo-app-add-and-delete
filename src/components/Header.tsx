import { useContext } from 'react';
// eslint-disable-next-line import/no-cycle
import { TodosContext } from './TodosContext';

export const Header: React.FC = () => {
  const {
    newTodos,
    handleInputChange,
    handleKeyDown,
    toggleAllChange,
    todos,
  } = useContext(TodosContext);

  const hasCompleted = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={`todoapp__toggle-all ${hasCompleted ? 'active' : ''} `}
        onClick={toggleAllChange}
      />
      <form>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodos}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </form>
    </header>
  );
};
