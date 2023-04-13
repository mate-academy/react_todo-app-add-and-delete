/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, ChangeEvent } from 'react';

type Props = {
  handleTodoChange: (event: ChangeEvent<HTMLInputElement>) => void;
  task: string;
};

export const NewTodo: FC<Props> = ({
  handleTodoChange,
  task,
}) => {
  return (
    <header className="todoapp__header">
      <button type="button" className="todoapp__toggle-all active" />

      <form>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleTodoChange}
          value={task}
        />
      </form>
    </header>
  );
};
