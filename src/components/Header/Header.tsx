import {
  FC,
  useState,
  FormEvent,
} from 'react';

type Props = {
  onSubmit: (title: string) => void;
  isInputDisabled: boolean;
  isAnyActiveTodos: boolean;
};

export const Header: FC<Props> = ({
  onSubmit,
  isAnyActiveTodos,
  isInputDisabled,
}) => {
  const [title, setTitle] = useState('');

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(title);
    setTitle('');
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        disabled={!isAnyActiveTodos}
        aria-label="toggle-button"
      />

      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
