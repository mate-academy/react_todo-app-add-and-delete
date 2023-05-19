/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FC, FormEvent, useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../userId';

interface Props {
  todos: Todo[];
  onCreate: (todoData: Todo) => void;
  tempTodo: Todo | null;
  onError: (error: string) => void;
}

export const HeaderTodoApp: FC<Props> = React.memo(({
  todos,
  onCreate,
  tempTodo,
  onError,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      onError("Title can't be empty");

      return;
    }

    await onCreate({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    setTitle('');
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
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={!!tempTodo}
        />
      </form>
    </header>
  );
});
