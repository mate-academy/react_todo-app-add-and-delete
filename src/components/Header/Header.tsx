import cn from 'classnames';
import React, { useState } from 'react';
import { ErrorMessage } from '../../types/ErrorMessage';
import { Todo } from '../../types/Todo';
import { addTodos } from '../../api/todos';
import { USER_ID } from '../../types/ConstantTypes';

type Props = {
  countActiveTodos: number;
  onShowError: (errorType: ErrorMessage) => void;
  onHideError: () => void;
  onChange: (newTitle: string) => void;
  onAddTodo: (newTodo: Todo) => void;
};

export const Header: React.FC<Props> = React.memo(({
  countActiveTodos,
  onShowError,
  onHideError,
  onChange,
  onAddTodo,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [hasInputDisabled, setHasInputDisabled] = useState(false);

  const handleAddNewTodo = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const title = newTodoTitle.trim();

    if (!title) {
      onShowError(ErrorMessage.EmptyTitle);

      return;
    }

    onHideError();
    onChange(title);

    setHasInputDisabled(true);

    addTodos({
      userId: USER_ID,
      title: newTodoTitle,
      completed: false,
    })
      .then((newTodo) => onAddTodo(newTodo))
      .catch(() => {
        onShowError(ErrorMessage.Add);
      })
      .finally(() => {
        onChange('');
        setNewTodoTitle('');
        setHasInputDisabled(false);
      });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: countActiveTodos === 0,
        })}
        aria-label="Toggle all todos"
      />

      <form onSubmit={handleAddNewTodo}>
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
