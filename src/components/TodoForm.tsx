import { FC, useState } from 'react';

interface Props {
  title: string;
  onSubmit: (title: string) => void;
}

export const TodoForm: FC<Props> = ({ title, onSubmit }) => {
  const [value, setValue] = useState(title);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        onChange={({ target }) => setValue(target.value)}
        value={value}
      />
    </form>
  );
};
