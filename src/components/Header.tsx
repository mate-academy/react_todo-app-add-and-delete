type Props = {
  title: string;
  onTitleChange: (value: string) => void;
  onAdd: (event: React.FormEvent) => void;
  inputRef: React.Ref<HTMLInputElement>;
  disabled?: boolean;
};

export const Header: React.FC<Props> = ({
  title,
  onTitleChange,
  onAdd,
  inputRef,
  disabled,
}) => (
  <header className="todoapp__header">
    <form onSubmit={onAdd}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={e => onTitleChange(e.target.value)}
        ref={inputRef}
        disabled={disabled}
      />
    </form>
  </header>
);
