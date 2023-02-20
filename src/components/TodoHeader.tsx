/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useState } from 'react';
import { getTodo } from '../api/todos';
import { Todo } from '../types/Todo';

type Props = {
  newTodoTitle: string;
  setNewTodoTitle: (event: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export const Header: React.FC<Props> = ({
  newTodoTitle,
  setNewTodoTitle,
  onSubmit,
}) => {
  const [todo, setTodo] = useState<Todo>();

  useEffect(() => {
    if (todo) {
      getTodo(todo.id).then(setTodo);
    }
  });

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={onSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={(event) => setNewTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
