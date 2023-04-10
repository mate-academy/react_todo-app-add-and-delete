import classNames from 'classnames';
import { useState } from 'react';

interface Props {
  onAdd: (title: string) => void;
  hasActiveTodos: boolean;
}

export const Header: React.FC<Props> = ({ onAdd, hasActiveTodos }) => {
  const [todoTitle, setTodoTitle] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTodoTitle('');
    onAdd(todoTitle);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: hasActiveTodos,
        })}
        aria-label={' '}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={(event) => setTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
