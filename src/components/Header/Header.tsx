/* eslint-disable no-console */
import React, { useState } from 'react';
import cn from 'classnames';
import { addTodo } from '../../api/todos';
import { Errors } from '../../types/Errors';

interface Props {
  numberOfActive: number;
  getTodosFromServer: () => void;
  showError: (message: Errors) => void;
  userId: number;
  createTempTodo: (title: string) => void;
}

export const Header: React.FC<Props> = React.memo(
  ({
    numberOfActive,
    getTodosFromServer,
    showError,
    userId,
    createTempTodo,
  }) => {
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [isInputDisabled, setIsInputDisabled] = useState(false);

    const handleNewTodoSubmit = (
      event: React.FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      const title = newTodoTitle.trim();

      if (!title) {
        showError(Errors.EMPTY_TITLE);
        setNewTodoTitle('');

        return;
      }

      setIsInputDisabled(true);

      const addTodoToServer = async () => {
        createTempTodo(title);
        try {
          await addTodo(userId, title);
        } catch (error) {
          showError(Errors.ADD);
        }

        await getTodosFromServer();
        createTempTodo('');
        setIsInputDisabled(false);
      };

      addTodoToServer();
      setNewTodoTitle('');
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => (
      setNewTodoTitle(event.target.value)
    );

    return (
      <header className="todoapp__header">
        <button
          aria-label="toogle_completed"
          type="button"
          className={cn('todoapp__toggle-all', {
            active: Boolean(numberOfActive),
          })}
        />

        <form onSubmit={handleNewTodoSubmit}>
          <input
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={newTodoTitle}
            onChange={handleInputChange}
            disabled={isInputDisabled}
          />
        </form>
      </header>
    );
  },
);
