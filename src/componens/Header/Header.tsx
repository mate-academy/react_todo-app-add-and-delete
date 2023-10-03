/* eslint-disable jsx-a11y/control-has-associated-label */

interface Props {
  setTextTodo: (text: string) => void,
  textTodo: string,
  createTodo: (
    title: string,
  ) => void,
  setErrorMessege: React.Dispatch<React.SetStateAction<string>>,
  statusResponse: boolean,
}

export const Header: React.FC<Props> = (
  {
    setTextTodo,
    textTodo,
    createTodo,
    setErrorMessege,
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
          if (!textTodo) {
            setErrorMessege('Title should not be empty');

            return;
          }

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
        />
      </form>
    </header>
  );
};
