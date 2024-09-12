import React, {
  FormEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

import './Header.scss';

type Props = {
  todos: Todo[];
  onToggle: (toggledTodos: Todo[]) => void;
  onAdding: (newTodo: string) => Promise<void>;
};

export const Header: React.FC<Props> = memo(function Header({
  todos,
  onToggle,
  onAdding,
}) {
  const areAllTodosCompleted = todos.every(todo => todo.completed);

  const addTodoInputRef = useRef<HTMLInputElement>(null);
  const addTodoInput = addTodoInputRef.current;

  const [newTodo, setNewTodo] = useState('');

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      if (!addTodoInput) {
        return;
      }

      addTodoInput.disabled = true;

      onAdding(newTodo)
        .then(() => setNewTodo(''))
        .finally(() => {
          addTodoInput.disabled = false;
          addTodoInput.focus();
        });
    },
    [addTodoInput, onAdding, newTodo],
  );

  useEffect(() => {
    addTodoInput?.focus();
  });

  return (
    <header className="Header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('Header__toggle-all', {
            active: areAllTodosCompleted,
          })}
          onClick={() => {
            onToggle(
              todos.map(todo => ({
                ...todo,
                completed: !areAllTodosCompleted,
              })),
            );
          }}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={addTodoInputRef}
          data-cy="NewTodoField"
          type="text"
          className="Header__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
        />
      </form>
    </header>
  );
});
