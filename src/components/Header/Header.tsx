/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  search: string,
  setSearch: (query: string) => void,
  handleAddTodo: () => void,
  setError: (arg: boolean) => void,
  setErrorMessage: (arg: string) => void,
};

export const Header: React.FC<Props> = ({
  todos,
  search,
  setSearch,
  handleAddTodo,
  setError,
  setErrorMessage,
}) => {
  const isActicve = todos.filter(todo => !todo.completed);
  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (!search.trim()) {
      setError(true);
      setErrorMessage('Title can\'t be empty');
    } else {
      handleAddTodo();
      setSearch('');
      setError(false);
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: isActicve },
        )}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </form>
    </header>
  );
};
