import React, { useState, useContext } from 'react';
import classNames from 'classnames';
import { addTodo } from '../api/todos';
import { ErrorType } from '../enums/ErrorType';
import { Todo } from '../types/Todo';
import { UserIdContext } from '../context/UserIdConext';

type Props = {
  activeTodosNum: number;
  showError: (error: ErrorType) => void;
  hideError: () => void;
  addNewTodo: (newTodo: Todo) => void;
  showTempTodo: (tempTodoTitle: string) => void;
};

const Header: React.FC<Props> = ({
  activeTodosNum,
  showError,
  hideError,
  addNewTodo,
  showTempTodo,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const userId = useContext(UserIdContext);

  const handleAddingNewTodo = (
    event: React.FormEvent<HTMLFormElement>,
  ): void => {
    event.preventDefault();

    const title = newTitle.trim();

    if (!title.length || !title.trim()) {
      showError(ErrorType.emptyTitle);

      return;
    }

    hideError();
    showTempTodo(title);

    setIsInputDisabled(true);

    addTodo(userId, {
      userId,
      title,
      completed: false,
    })
      .then((newTodo) => addNewTodo(newTodo))
      .catch(() => {
        showError(ErrorType.add);
      })
      .finally(() => {
        showTempTodo('');
        setNewTitle('');
        setIsInputDisabled(false);
      });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: activeTodosNum === 0 },
        )}
        aria-label="Toggle all todos"
      />

      <form onSubmit={handleAddingNewTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};

export default Header;
