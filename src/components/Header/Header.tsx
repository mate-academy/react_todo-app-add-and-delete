import { FormEvent, useEffect, useRef } from 'react';

type Props = {

  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (event: FormEvent) => void;
};

export const Header: React.FC<Props> = ({

  title,
  setTitle,
  handleSubmit,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const onAdd = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(value);
  };

  return (
    <header className="todoapp__header">
      <button
        aria-label="active"
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={onAdd}
        />
      </form>
    </header>
  );
};
