type Props = {
  activeInput: React.RefObject<HTMLInputElement>;
};

export const Form: React.FC<Props> = ({ activeInput }) => {
  return (
    <form>
      <input
        ref={activeInput}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
      />
    </form>
  );
};
