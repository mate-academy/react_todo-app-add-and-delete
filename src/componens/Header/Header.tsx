/* eslint-disable jsx-a11y/control-has-associated-label */

interface Props {
  setTextTodo: (text: string) => void,
  textTodo: string,
  createTodo: (
    title: string,
  ) => void,
  statusResponse: boolean,
}

export const Header: React.FC<Props> = (
  {
    setTextTodo,
    textTodo,
    createTodo,
    statusResponse,
  },
) => {
  return (
    <header className="todoapp__header">

      <button type="button" className="todoapp__toggle-all active" />

      {/* Add a todo on form submit */}
      <form
        onSubmit={(event) => {
          event.preventDefault();

          createTodo(textTodo.trim());
        }}
      >
        <input
          disabled={statusResponse}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={textTodo}
          onChange={(event) => setTextTodo(event.target.value)}
          ref={(input) => input && input.focus()}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
      </form>
    </header>
  );
};
