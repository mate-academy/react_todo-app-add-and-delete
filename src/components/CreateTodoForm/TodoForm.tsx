import { FormEventHandler, useState } from 'react';

interface Props {
  inputDisabled: boolean;
  onFormSubmit: (title: string) => void;
}

export const TodoForm: React.FC<Props> = ({ inputDisabled, onFormSubmit }) => {
  const [title, setTitle] = useState('');

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    onFormSubmit(title);

    setTitle('');
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="Set a goal? Build a plan here! Do it"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        disabled={inputDisabled}
      />
    </form>
  );
};
