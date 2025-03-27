import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { RequestStatus } from '../../types/RequestStatus';

type Props = {
  todos: Todo[];
  addingStatus: RequestStatus;
  onAdd: (newTodoTitle: string) => void;
  onToggleAll: (completeAll: boolean) => void;
};

export const TodoAppHeader: React.FC<Props> = React.memo(
  ({ todos, addingStatus, onAdd, onToggleAll }) => {
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const hasAllCompleted = todos.every(todo => !!todo.completed);

    const focusOnInput = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    useEffect(() => {
      if (addingStatus === RequestStatus.None) {
        setNewTodoTitle('');
      }

      focusOnInput();
    }, [todos.length, addingStatus]);

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onAdd(newTodoTitle.trim());
    };

    const OnInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewTodoTitle(event.target.value);
    };

    return (
      <header className="todoapp__header">
        {todos.length > 0 && (
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: hasAllCompleted,
            })}
            data-cy="ToggleAllButton"
            onClick={() => onToggleAll(!hasAllCompleted)}
          />
        )}

        <form onSubmit={onSubmit}>
          <input
            ref={inputRef}
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={newTodoTitle}
            onChange={OnInputChange}
            disabled={addingStatus === RequestStatus.Processing}
            autoFocus
          />
        </form>
      </header>
    );
  },
);

TodoAppHeader.displayName = 'TodoAppHeader';
