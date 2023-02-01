/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { AuthContext } from '../Auth/AuthContext';
import { Todo } from '../../types/Todo';
import { ErrorTypes } from '../../types/ErrorTypes';

type Props = {
  addTodo: (fieldsToCreate: Omit<Todo, 'id'>) => Promise<void>;
  isAddingTodo: boolean;
  showError: (message: string) => void;
};

export const Header: React.FC<Props> = React.memo(
  ({
    addTodo,
    isAddingTodo,
    showError,
  }) => {
    const user = useContext(AuthContext);
    const newTodoField = useRef<HTMLInputElement>(null);

    const [title, setTitle] = useState('');

    useEffect(() => {
      // focus the element with `ref={newTodoField}`
      if (newTodoField.current) {
        newTodoField.current.focus();
      }
    }, [isAddingTodo]);

    const handleFormSubmit = async () => {
      if (!title.trim()) {
        showError(ErrorTypes.EmptyTitle);

        return;
      }

      if (!user) {
        showError(ErrorTypes.UserNotFound);

        return;
      }

      const fieldsToCreate = {
        userId: user.id,
        title,
        completed: false,
      };

      await addTodo(fieldsToCreate);

      setTitle('');
    };

    return (
      <header className="todoapp__header">
        <button
          data-cy="ToggleAllButton"
          type="button"
          className="todoapp__toggle-all active"
        />

        <form
          action="/api/users"
          method="POST"
          onSubmit={(event) => {
            event.preventDefault();
            handleFormSubmit();
          }}
        >
          <input
            data-cy="NewTodoField"
            type="text"
            ref={newTodoField}
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            disabled={isAddingTodo}
            value={title}
            onChange={(event) => setTitle(event.currentTarget.value)}
          />
        </form>
      </header>
    );
  },
);
