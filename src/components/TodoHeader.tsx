/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  onTodoAdd: (todoTitle: string) => Promise<void>;
  onTodoAddError: (errorMessage: string) => void;
  isAllTodosCompleted: boolean;
  onTodosChangeStatus: () => void;
  todos: Todo[];
  isTodosHere: boolean;
};

export const TodoHeader: React.FC<Props> = ({
  onTodoAdd,
  onTodoAddError,
  isAllTodosCompleted,
  onTodosChangeStatus,
  todos,
  isTodosHere,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimedTodoTitle = todoTitle.trim();

    if (!trimedTodoTitle) {
      onTodoAddError('Title should not be empty');

      return;
    }

    setIsAdding(true);
    onTodoAdd(trimedTodoTitle)
      .then(() => {
        setTodoTitle('');
      })
      .finally(() => {
        setIsAdding(false);
      });
  };

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [todos.length]);

  return (
    <header className="todoapp__header">
      {isTodosHere && (
        <button
          data-cy="ToggleAllButton"
          onClick={onTodosChangeStatus}
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllTodosCompleted,
          })}
        />
      )}

      <form onSubmit={onFormSubmit}>
        <input
          ref={titleField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={onTitleChange}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
