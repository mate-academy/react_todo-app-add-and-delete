import { useContext, useState } from 'react';
import { addTodo } from '../api/todos';
import { SetErrorContext } from '../utils/setErrorContext';

interface Props {
  userId: number,
}

export const TodoSubmit: React.FC<Props> = ({ userId }) => {
  const [todoTitle, setTodoTitle] = useState('');

  const setError = useContext(SetErrorContext);

  const handleSubmit = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter') {
      if (todoTitle) {
        addTodo({
          title: todoTitle,
          completed: false,
          userId,
        });
        setTodoTitle('');
      } else {
        setError?.('emptytitle');
        // #TODO: get rid of the nasty ?. somehow
      }
    }
  };

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
          value={todoTitle}
          onChange={(event) => setTodoTitle(event.target.value)}
          onKeyDown={handleSubmit}
        />
      </form>
    </header>
  );
};
