import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  onAddTodo: (title: string) => Promise<void>;
  onToggleAll: () => void; //function for "Toggle All"
  todos: Todo[];
  isAdding: boolean; //Прямо сейчас идёт запрос на добавление нового tod
};

export const Header: React.FC<Props> = ({
  todos,
  onAddTodo,
  onToggleAll,
  isAdding,
}) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding, todos.length]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await onAddTodo(title);
      setTitle('');
    } catch {}
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const handleToggleAll = () => {
    onToggleAll();
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', { active: allCompleted })}
        data-cy="ToggleAllButton"
        onClick={handleToggleAll}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={handleChange}
          //autoFocus
          ref={inputRef}
          disabled={isAdding}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
