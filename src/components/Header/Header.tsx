import React, { useState, useContext } from 'react';
import classNames from 'classnames';
import { UserIdContext } from '../../utils/context';
import { Todo } from '../../types/Todo';
import { createTodo } from '../../api/todos';
import { PossibleError } from '../../types/PossibleError';

type Props = {
  activeTodosLength: number;
  showTempTodo: (tempTodoTilte: string) => void;
  createNewTodo: (newTodo: Todo) => void;
  showError: (possibleError: PossibleError) => void;
  hideError: () => void;
};

export const Header: React.FC<Props> = ({
  activeTodosLength,
  showTempTodo,
  createNewTodo,
  showError,
  hideError,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isInputIncorrect, setIsInputIncorrect] = useState(false);

  const userId = useContext(UserIdContext);

  function handleCreateNewTodo(
    event: React.FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();

    const title = newTodoTitle.trim();

    if (!title) {
      showError(PossibleError.EmptyTitle);

      return;
    }

    hideError();
    showTempTodo(title);

    setIsInputIncorrect(true);

    createTodo(userId, {
      userId,
      title,
      completed: false,
    })
      .then((newTodo) => createNewTodo(newTodo))
      .catch(() => {
        showError(PossibleError.Add);
      })
      .finally(() => {
        showTempTodo('');
        setNewTodoTitle('');
        setIsInputIncorrect(false);
      });
  }

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: activeTodosLength === 0,
        })}
        aria-label="Toggle all todos"
      />

      <form onSubmit={handleCreateNewTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={(event) => setNewTodoTitle(event.target.value)}
          disabled={isInputIncorrect}
        />
      </form>
    </header>
  );
};
