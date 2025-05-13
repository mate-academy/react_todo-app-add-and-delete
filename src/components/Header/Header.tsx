import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  addTodo: () => Promise<void>;
  disabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  patch: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
};

export const Header: React.FC<Props> = ({
  todos,
  query,
  setQuery,
  addTodo,
  disabled,
  inputRef,
  patch,
}) => {
  const helper = todos.every(todo => todo.completed);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setQuery(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await addTodo();
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: helper,
          })}
          data-cy="ToggleAllButton"
          onClick={event => patch(event)}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleChange}
          ref={inputRef}
          disabled={disabled}
          autoFocus
        />
      </form>
    </header>
  );
};
