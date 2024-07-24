import { useAppContextContainer } from '../../context/AppContext';

const TodoHeader = () => {
  const { inputRef, addTodo, queryText, handleChangeQueryText } =
    useAppContextContainer();

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    handleChangeQueryText(value);
  };

  const handleSubmitNewTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    addTodo(queryText);
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmitNewTodo}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          value={queryText}
          onChange={handleChangeText}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};

export default TodoHeader;
