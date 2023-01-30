/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  memo, useContext, useEffect, useRef, useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

export type Props = {
  onSubmit: (todo: Omit<Todo, 'id'>) => void
  showErrorMessage: (v: string) => void
  temporaryTodo: Todo | null
};

export const Header: React.FC<Props> = memo(({
  onSubmit,
  showErrorMessage,
  temporaryTodo,

}) => {
  const user = useContext(AuthContext);

  const [title, setTitle] = useState('');

  const newTodoField = useRef<HTMLInputElement>(null);

  const shouldDisableInput = temporaryTodo !== null;

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (user === null) {
      return;
    }

    if (title === '') {
      showErrorMessage('Title can\'t be empty');

      return;
    }

    onSubmit({
      title,
      userId: user.id,
      completed: false,
    });

    setTitle('');
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          disabled={shouldDisableInput}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
});
