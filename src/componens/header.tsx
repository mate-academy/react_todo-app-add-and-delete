import React, { FormEvent, useRef, useEffect } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  addTodo: (event: FormEvent<HTMLFormElement>) => void;
  todo: string;
  todos: Todo[];
  setTodo: React.Dispatch<React.SetStateAction<string>>;
  updateCompleted: (todoItem: Todo) => void;
  isLoadingIds: number[];
};
export const Header: React.FC<Props> = ({
  addTodo,
  todo,
  todos,
  setTodo,
  updateCompleted,
  isLoadingIds,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const allCompleted = todos.every(tod => tod.completed);
  const toggleAllButton = () => {
    const incompleteTodos = todos.filter(tod => !tod.completed);

    const todosToUpdate = incompleteTodos.length > 0 ? incompleteTodos : todos;

    Promise.all(todosToUpdate.map(tod => updateCompleted(tod)));
  };

  useEffect(() => {
    if (!todo) {
      inputRef.current?.focus();
    }
  }, [todos]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: allCompleted && todos.length > 0,
        })}
        data-cy="ToggleAllButton"
        onClick={toggleAllButton}
      />

      <form onSubmit={addTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todo}
          onChange={e => setTodo(e.target.value)}
          disabled={isLoadingIds.length > 0}
          ref={inputRef}
          autoFocus
        />
      </form>
    </header>
  );
};
