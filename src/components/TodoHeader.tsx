import React, { useCallback, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  newTodoInput: string;
  setNewTodoInput: React.Dispatch<React.SetStateAction<string>>;
  addTodo: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  newInputRef: React.MutableRefObject<HTMLInputElement | null>;
  loadingIds: number[];
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  newTodoInput,
  setNewTodoInput,
  addTodo,
  isLoading,
  newInputRef,
  loadingIds,
}) => {
  const hasTodos = todos.length > 0;
  const allTodosCompleted = hasTodos && todos.every(todo => todo.completed);

  useEffect(() => {
    newInputRef.current?.focus();
  }, [newInputRef, isLoading, loadingIds]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewTodoInput(event.target.value);
    },
    [setNewTodoInput],
  );

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allTodosCompleted,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={addTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoInput}
          onChange={handleInputChange}
          ref={newInputRef}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
