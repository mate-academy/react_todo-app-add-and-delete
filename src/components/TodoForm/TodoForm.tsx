import { FormEvent } from 'react';

type Props = {
  handleSubmit: (e: FormEvent<Element>) => void;
  isCreated: boolean;
  value: string;
  inputHandler: (e: string) => void;
};

export const TodoForm: React.FC<Props> = ({
  handleSubmit, isCreated, value, inputHandler,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={isCreated}
        value={value}
        onChange={(e) => inputHandler(e.target.value)}
      />
    </form>
  );
};
