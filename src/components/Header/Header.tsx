import React, { useState, useContext } from 'react';
import classNames from 'classnames';
import { UserContext } from '../../UserContext';
import { ErrorType } from '../../types/ErrorType';
import { Todo } from '../../types/Todo';
import { addTodo } from '../../api/todos';

type Props = {
  activeTodosAmount: number;
  showError: (errorType: ErrorType) => void;
  hideError: () => void;
  showTempTodo: (tempTodoTitle: string) => void;
  addNewTodo: (newTodo: Todo) => void;
};

export const Header: React.FC<Props> = React.memo(({
  activeTodosAmount,
  showError,
  hideError,
  showTempTodo,
  addNewTodo,
}) => {
  const [newTodoName, setNewTodoName] = useState('');
  const [isInvalidInput, setIsInvalidInput] = useState(false);
  const userId = useContext(UserContext);

  function handleAddTodo(
    event: React.FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();

    const title = newTodoName.trim();

    if (!title) {
      showError(ErrorType.EmptyTitle);

      return;
    }

    hideError();
    showTempTodo(title);

    setIsInvalidInput(true);

    addTodo(userId, {
      userId,
      title,
      completed: false,
    })
      .then((newTodo) => addNewTodo(newTodo))
      .catch(() => {
        showError(ErrorType.Add);
      })
      .finally(() => {
        showTempTodo('');
        setNewTodoName('');
        setIsInvalidInput(false);
      });
  }

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: !activeTodosAmount,
        })}
        aria-label="Toggle all todos"
      />

      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoName}
          onChange={(event) => setNewTodoName(event.target.value)}
          disabled={isInvalidInput}
        />
      </form>
    </header>
  );
});
