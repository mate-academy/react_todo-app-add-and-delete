import { RefObject } from 'react';

type Props = {
  newTodoField: RefObject<HTMLInputElement>,
  input: string,
  isAdding: boolean,
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onSubmit: () => void,
};

export const NewTodo: React.FC<Props> = ({
  newTodoField,
  onInputChange,
  onSubmit,
  input,
  isAdding,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        onChange={onInputChange}
        value={input}
        disabled={isAdding}
      />
    </form>
  );
};
