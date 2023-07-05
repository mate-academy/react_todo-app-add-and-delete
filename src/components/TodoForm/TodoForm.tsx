import React, { useState } from 'react';
import cN from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  onAddTodo: (title: string) => void;
};

export const TodoForm: React.FC<Props> = ({
  todos,
  onAddTodo,
}) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const hasTodos = Boolean(todos.length);
  const hasActiveTodos = todos.filter(todo => !todo.completed);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true);

    await onAddTodo(todoTitle);

    setIsLoading(false);
    setTodoTitle('');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          aria-label="setAllComplete"
          type="button"
          className={cN('todoapp__toggle-all', {
            active: !hasActiveTodos,
          })}
        />
      )}

      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleChange}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
