import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { addTodo } from '../../api/todos';

import { ErrorType } from '../../enums/ErrorType';

import { Todo } from '../../types/Todo';
import { UserIdContext } from '../../contexts/UserIdContext';

type Props = {
  activeTodosNum: number;
  showError: (errorType: ErrorType) => void;
  hideError: () => void;
  showTempTodo: (tempTodoTitle: string) => void;
  addNewTodo: (newTodo: Todo) => void;
};

export const TodoHeader: React.FC<Props> = React.memo(
  ({
    activeTodosNum,
    showError,
    hideError,
    showTempTodo,
    addNewTodo,
  }) => {
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [isInputDisabled, setIsInputDisabled] = useState(false);

    const userId = useContext(UserIdContext);

    function handleAddingNewTodo(
      event: React.FormEvent<HTMLFormElement>,
    ): void {
      event.preventDefault();

      const title = newTodoTitle.trim();

      if (!title) {
        showError(ErrorType.EmptyTitle);

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
          showError(ErrorType.Add);
        })
        .finally(() => {
          showTempTodo('');
          setNewTodoTitle('');
          setIsInputDisabled(false);
        });
    }

    return (
      <header className="todoapp__header">
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: activeTodosNum === 0,
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
            disabled={isInputDisabled}
          />
        </form>
      </header>
    );
  },
);
