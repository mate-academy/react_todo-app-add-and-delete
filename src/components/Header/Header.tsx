import classNames from 'classnames';

type Props = {
  activeTodos: number;
  hasTodos: boolean;
  query: string;
  isDisable: boolean;
  onQuery: (newQuery: string) => void;
  onError: (text: string) => void;
  onAdd: () => void;
};

export const Header: React.FC<Props> = ({
  activeTodos,
  hasTodos,
  query,
  isDisable,
  onQuery,
  onError,
  onAdd,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query.trim()) {
      onError('Title can`t be empty');
    } else {
      onAdd();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onQuery(e.target.value);
  };

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: activeTodos },
          )}
          aria-label="Complete All"
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleChange}
          disabled={isDisable}
        />
      </form>
    </header>
  );
};
