import React, {
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Errors } from '../../types/Error';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

interface Props {
  setErrorMessage: (message: Errors) => void,
  isAdding: boolean,
  onAddTodo: (data: Omit<Todo, 'id'>) => Promise<any>,
}

export const Header: React.FC<Props> = memo((props) => {
  const {
    setErrorMessage,
    isAdding,
    onAddTodo,
  } = props;

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isAdding]);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage(Errors.TitleError);

      return;
    }

    if (user) {
      await onAddTodo({
        userId: user?.id,
        title: title.trim(),
        completed: false,
      });

      setTitle('');
    }
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
});
