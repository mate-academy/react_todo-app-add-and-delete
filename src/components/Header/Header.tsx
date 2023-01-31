/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FormEvent,
  memo,
  useContext,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

interface HeaderProps {
  newTodoField: React.RefObject<HTMLInputElement>;
  showError: (message: string) => void,
  isAddingTodo: boolean,
  addTodo: (fieldsToCreate: Omit<Todo, 'id'>) => Promise<unknown>,
}

export const Header: React.FC<HeaderProps> = memo(
  ({
    newTodoField,
    showError,
    isAddingTodo,
    addTodo,
  }) => {
    const [title, setTitle] = useState('');
    const user = useContext(AuthContext);

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!title.trim()) {
        showError('Title is required');

        return;
      }

      if (!user) {
        showError('User not found');

        return;
      }

      try {
        await addTodo({
          title,
          userId: user.id,
          completed: false,
        });

        setTitle('');
      } catch {
        showError('');
      }
    };

    return (
      <header className="todoapp__header">
        <button
          data-cy="ToggleAllButton"
          type="button"
          className="todoapp__toggle-all active"
        />

        <form
          onSubmit={handleFormSubmit}
        >
          <input
            disabled={isAddingTodo}
            data-cy="NewTodoField"
            type="text"
            ref={newTodoField}
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </form>
      </header>
    );
  },
);
