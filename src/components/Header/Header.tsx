import { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  showError: (text: string) => void;
  todos: Todo[],
  isActive: number;
  createTodo: (data: Omit<Todo, 'id'>) => void;
}

export const Header: React.FC<Props> = ({
  todos,
  isActive,
  showError,
  createTodo,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent<EventTarget>): void => {
    e.preventDefault();
    if (query.length === 0) {
      showError("Title can't be empty");

      return;
    }

    createTodo({
      title: query,
      completed: false,
      userId: 0,
    });
    setQuery('');
  };

  const handleButtonCompleted = () => {};

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          aria-label="todo comleted"
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: !isActive,
          })}
          onClick={handleButtonCompleted}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </form>
    </header>
  );
};
