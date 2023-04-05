import { FC } from 'react';

type Props = {
  handleAddTodo: (event: React.FormEvent<HTMLFormElement>) => void
  setTodoTitle: (title: string) => void;
  todoTitle: string
  activeInput: boolean;
};

export const Form: FC<Props> = ({
  handleAddTodo,
  setTodoTitle,
  todoTitle,
  activeInput,
}) => {
  return (
    <form onSubmit={handleAddTodo}>
      <input
        type="text"
        disabled={!activeInput}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={todoTitle}
        onChange={({ target }) => setTodoTitle(target.value)}
      />

    </form>
  );
};
