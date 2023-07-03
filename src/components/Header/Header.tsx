import { useState } from 'react';

type Props = {
  setError: (error:string) => void;
  addNewTodo: (newTitle:string) => void;
  isLoading: boolean,
};

export const Header:React.FC<Props> = ({
  setError,
  addNewTodo,
  isLoading,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const handleSubmit = (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newTodoTitle.length === 0) {
      setError('Title can\'t be empty');
    }

    addNewTodo(newTodoTitle);
    setNewTodoTitle('');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {/*  eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button type="button" className="todoapp__toggle-all active" />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={handleChange}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
