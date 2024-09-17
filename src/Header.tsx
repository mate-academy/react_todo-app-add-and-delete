type Props = {
  HandleSubmit: (event: React.FormEvent) => void;
  titleTodo: string;
  HandleTitle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputFocus: React.RefObject<HTMLInputElement>;
  inputTodo: boolean;
};

export const Header: React.FC<Props> = ({
  HandleSubmit,
  titleTodo,
  HandleTitle,
  inputFocus,
  inputTodo,
}) => {
  return (
    <header className="todoapp__header">
      <form onSubmit={HandleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          value={titleTodo}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={HandleTitle}
          ref={inputFocus}
          disabled={!inputTodo}
        />
      </form>
    </header>
  );
};
