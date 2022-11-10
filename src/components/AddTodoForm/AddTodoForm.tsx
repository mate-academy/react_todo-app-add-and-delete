import { useEffect } from 'react';

type Props = {
  handleAddTodo: () => void;
  handleInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  newTodoField: React.RefObject<HTMLInputElement>;
  titleNewTodo: string;
  isAdding: boolean;
};

export const AddTodoForm: React.FC<Props> = ({
  handleAddTodo,
  handleInput,
  newTodoField,
  titleNewTodo,
  isAdding,
}) => {
  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isAdding]);

  return (
    <form onSubmit={handleAddTodo}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={titleNewTodo}
        onChange={event => handleInput(event)}
        disabled={isAdding}
      />
    </form>
  );
};
