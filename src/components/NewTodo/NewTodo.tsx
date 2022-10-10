import { FormEvent, RefObject } from 'react';

interface Props {
  handleSubmit: (event: FormEvent) => void;
  newTodoField: RefObject<HTMLInputElement>;
  title: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isAdd: boolean
}

export const Header: React.FC<Props> = ({
  handleSubmit,
  newTodoField,
  title,
  handleChange,
  isAdd,
}) => {
  return (
    <header className="todoapp__header">
      <button
        aria-label="close"
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChange}
          disabled={isAdd}
        />
      </form>
    </header>
  );
};
