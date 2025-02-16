import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect } from 'react';
import React from 'react';

type Props = {
  todos: Todo[];
  newTodoInput: string;
  setNewTodoInput: React.Dispatch<React.SetStateAction<string>>;
  addTodo: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  loadingIds: number[];
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  newTodoInput,
  setNewTodoInput,
  addTodo,
  isLoading,
  inputRef,
  loadingIds,
}) => {
  const completedTodos = todos.filter(todo => todo.completed);

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef, isLoading, loadingIds]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: completedTodos.length === todos.length,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form
        onSubmit={event => {
          addTodo(event);
        }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoInput}
          onChange={event => setNewTodoInput(event.target.value)}
          ref={inputRef}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
