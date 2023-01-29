/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FC, FormEvent, useEffect, useRef, useState, useContext,
} from 'react';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  onAddTodo: (todoInfo: Omit<Todo, 'id'>) => void;
  showError: (message: string) => void;
  isAddingTodo: boolean;
};

export const NewTodoField: FC<Props> = React.memo((props) => {
  const {
    showError, isAddingTodo, onAddTodo,
  } = props;

  const newTodoField = useRef<HTMLInputElement>(null);
  const user = useContext(AuthContext);

  const [title, setTitle] = useState('');

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      showError('Title can\'t be empty');

      return;
    }

    if (!user) {
      showError('User is not found');

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      title,
      completed: false,
      userId: user.id,
    };

    onAddTodo(newTodo);

    setTitle('');
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={handleFormSubmit}>
        <input
          ref={newTodoField}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isAddingTodo}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
});
