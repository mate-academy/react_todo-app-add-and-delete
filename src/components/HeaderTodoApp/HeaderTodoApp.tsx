/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FC, FormEvent, useState,
} from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  USER_ID: number;
  createTodo: (todoData: Todo) => void;
  tempTodo: Todo | null;
  setError: (error: string) => void;
}

export const HeaderTodoApp: FC<Props> = React.memo(({
  todos,
  USER_ID,
  createTodo,
  tempTodo,
  setError,
}) => {
  const [name, setName] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Title can't be empty");

      return;
    }

    await createTodo({
      id: 0,
      userId: USER_ID,
      title: name,
      completed: false,
    });

    setName('');
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className="todoapp__toggle-all"
        />
      )}

      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={!!tempTodo}
        />
      </form>
    </header>
  );
});
