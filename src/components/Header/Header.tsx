import { FormEventHandler, RefObject } from 'react';

type Props = {
  newTodoField: RefObject<HTMLInputElement>;
  handleSubmit: FormEventHandler<HTMLFormElement>;
  title: string;
  setTitle: (value: string) => void;
};

export const Header: React.FC<Props> = ({
  newTodoField,
  title,
  handleSubmit,
  setTitle,
}) => {
  return (

    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
        aria-label="tog"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
