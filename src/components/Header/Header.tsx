import classNames from 'classnames';
import { useState } from 'react';

interface Props {
  onAdd: (title: string) => Promise<void>;
  isLoading: boolean;
  hasActiveTodos: boolean;
}

export const Header: React.FC<Props> = ({
  onAdd,
  isLoading,
  hasActiveTodos,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onAdd(todoTitle);
    setTodoTitle('');
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
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
