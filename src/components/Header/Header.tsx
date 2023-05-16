import { FC, useState } from 'react';
import { USER_ID } from '../../utils/fetchClient';
import { NewTodoData } from '../../types/Todo';

interface HeaderProps {
  addTodo: (newTodo: NewTodoData) => void;
  onTitleError: (hasTitle: boolean) => void;
  onError: () => void;
}

export const Header: FC<HeaderProps> = ({
  addTodo,
  onTitleError,
  onError,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title) {
      onError();
      onTitleError(true);
    } else {
      const todoData: NewTodoData = {
        userId: USER_ID,
        title,
        completed: false,
      };

      addTodo(todoData);

      setTitle('');
    }
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button type="button" className="todoapp__toggle-all active" />

      <form
        action="/users"
        method="POST"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
