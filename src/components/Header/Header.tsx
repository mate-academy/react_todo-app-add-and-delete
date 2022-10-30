import React, {
  FormEvent,
  ChangeEvent,
} from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>,
  onAddTodo: (event: FormEvent) => void,
  title: string,
  setTitle: (value:string) => void,
  disabled: boolean,
};

export const Header: React.FC<Props> = ({
  newTodoField,
  onAddTodo,
  title,
  setTitle,
  disabled,
}) => {
  const setInputTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      <button
        aria-label="active"
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all"
      />

      <form onSubmit={onAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          disabled={disabled}
          onChange={setInputTitle}
        />
      </form>
    </header>
  );
};
