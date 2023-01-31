import {
  FormEvent,
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  showError: (message: string) => void,
  isAddingTodo: boolean;
  onAddTodo: (fieldsForCreate: Omit<Todo, 'id'>) => Promise<void>;
};

export const Header: React.FC<Props> = memo((props) => {
  const {
    showError,
    isAddingTodo,
    onAddTodo,
  } = props;

  const user = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isAddingTodo]);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      showError('Title is required');

      return;
    }

    if (!user) {
      showError('User not found');

      return;
    }

    try {
      await onAddTodo({
        title,
        userId: user.id,
        completed: false,
      });

      setTitle('');
    } catch { /* empty */ }
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
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
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
});
