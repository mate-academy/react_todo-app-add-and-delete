import cn from 'classnames';
import { Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';
import { useEffect, useRef } from 'react';

interface Props {
  todos: Todo[];
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  newTodo: string;
  isSubmitting: boolean;
  addTodo: (todo: Omit<Todo, 'id'>) => void;
}

export const Header: React.FC<Props> = ({
  todos,
  handleSubmit,
  handleChange,
  newTodo,
  addTodo,
  isSubmitting,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && !isSubmitting) {
      inputRef.current.focus();
    }
  }, [newTodo, isSubmitting]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTodo.trim() !== '') {
      addTodo({ title: newTodo.trim(), completed: false, userId: USER_ID });
    }
  };

  return (
    <header className="todoapp__header">
      {todos && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: todos })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          ref={inputRef}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
