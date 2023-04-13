import { ChangeEvent, FormEvent, useState } from 'react';

type Props = {
  onAddTodo: (title: string) => Promise<void>;
  disable: boolean;
};

export const Header: React.FC<Props> = (props) => {
  const {
    disable,
    onAddTodo,
  } = props;

  const [title, setTitle] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    onAddTodo(title);
    setTitle('');
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button type="button" className="todoapp__toggle-all active" />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChange}
          disabled={disable}
        />
      </form>
    </header>
  );
};
