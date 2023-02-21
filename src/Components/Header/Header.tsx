import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { addTodos } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../types/ErrorMessage';
import { UserIdContext } from '../../utils/context';

type Props = {
  counterActiveTodos: number;
  showError: (errorType: ErrorMessage) => void;
  hideError: () => void;
  showCreatingTodo: (creatingTodoTitle: string) => void;
  addNewTodo: (newTodo: Todo) => void;
};

export const Header: React.FC<Props> = React.memo(({
  counterActiveTodos,
  showError,
  hideError,
  showCreatingTodo,
  addNewTodo,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [hasInputDisabled, setHasInputDisabled] = useState(false);

  const userId = useContext(UserIdContext);

  function handleAddingNewTodo(
    event: React.FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();

    const title = newTodoTitle.trim();

    if (!title) {
      showError(ErrorMessage.EmptyTitle);

      return;
    }

    hideError();
    showCreatingTodo(title);

    setHasInputDisabled(true);

    addTodos(userId, {
      userId,
      title,
      completed: false,
    })
      .then((newTodo) => addNewTodo(newTodo))
      .catch(() => {
        showError(ErrorMessage.Add);
      })
      .finally(() => {
        showCreatingTodo('');
        setNewTodoTitle('');
        setHasInputDisabled(false);
      });
  }

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: counterActiveTodos === 0,
        })}
        aria-label="Toggle all todos"
      />

      <form onSubmit={handleAddingNewTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={(event) => setNewTodoTitle(event.target.value)}
          disabled={hasInputDisabled}
        />
      </form>
    </header>
  );
});
