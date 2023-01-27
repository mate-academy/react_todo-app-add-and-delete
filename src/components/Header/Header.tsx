/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

interface Props {
  onAddTodo: (fieldsForCreate: Omit<Todo, 'id'>) => Promise<any>;
  isAddingTodo: boolean,
  showError: (message: string) => void;
}

export const Header: React.FC<Props> = memo((props) => {
  const {
    showError,
    isAddingTodo,
    onAddTodo,
  } = props;
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [newTodoTitle, setNewTodoTitle] = useState('');

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isAddingTodo]);

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      showError('Title can\'t be empty');

      return;
    }

    if (!user) {
      showError('User is not found');

      return;
    }

    try {
      await onAddTodo({
        title: newTodoTitle,
        userId: user.id,
        completed: false,
      });

      setNewTodoTitle('');
    } catch { /* empty */ }
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={submitForm}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={(event) => setNewTodoTitle(event.target.value)}
          disabled={isAddingTodo}
        />
      </form>
    </header>
  );
});
