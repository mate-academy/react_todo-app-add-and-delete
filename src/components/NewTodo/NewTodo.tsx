/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, ChangeEvent } from 'react';

type Props = {
  handleTodoChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleTodoSubmit: (event: ChangeEvent<HTMLFormElement>) => void;
  task: string;
  isDataUpdated: boolean;
};

export const NewTodo: FC<Props> = ({
  handleTodoChange,
  handleTodoSubmit,
  task,
  isDataUpdated,
}) => {
  return (
    <header className="todoapp__header">
      <button type="button" className="todoapp__toggle-all active" />

      <form onSubmit={handleTodoSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleTodoChange}
          value={task}
          disabled={isDataUpdated && !!task}
        />
      </form>
    </header>
  );
};
