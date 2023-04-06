/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState } from 'react';
import { useAppContext } from '../AppProvider';

export const Header = () => {
  const [title, setTitle] = useState('');
  const { addTempTodo } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title.trim()) {
      setIsLoading(true);
      addTempTodo(title).finally(() => {
        setIsLoading(false);
      });
      setTitle('');
    }
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button type="button" className="todoapp__toggle-all active" />

      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
