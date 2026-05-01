import { RefObject } from 'react';

type Props = {
  title: string;
  inputRef: RefObject<HTMLInputElement>;
  isSubmitting: boolean;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export const HeaderForm = ({
  title,
  inputRef,
  isSubmitting,
  handleInputChange,
  handleSubmit,
}: Props) => {
  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={handleInputChange}
        disabled={isSubmitting}
      />
    </form>
  );
};
