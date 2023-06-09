import { useContext } from 'react';
import { UserIdContext } from '../utils/userIdContext';

export const TodoSubmit: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const userId = useContext(UserIdContext);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        aria-label="Toggle all"
      />

      {/* Add a todo on form submit */}
      <form>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
