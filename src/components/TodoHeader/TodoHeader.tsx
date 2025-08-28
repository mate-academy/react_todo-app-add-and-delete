import classNames from 'classnames';

type Props = {
  quantityActiveTasks: number;
  handleSearchQuery: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchQuery: string | '';
  inputRef: React.RefObject<HTMLInputElement>;
  setSearchQuery: (value: string) => void;
  isAddLoading: boolean;
  handleAddTodo: (
    title: string,
    setSearchQuery: (value: string) => void,
  ) => void;
};

export const TodoHeader: React.FC<Props> = ({
  quantityActiveTasks,
  handleSearchQuery,
  searchQuery,
  handleAddTodo,
  inputRef,
  setSearchQuery,
  isAddLoading,
}: Props) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: quantityActiveTasks === 0,
        })}
        data-cy="ToggleAllButton"
      />

      <form
        onSubmit={e => {
          e.preventDefault();
          handleAddTodo(searchQuery, setSearchQuery);
        }}
      >
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={searchQuery}
          onChange={handleSearchQuery}
          disabled={isAddLoading}
        />
      </form>
    </header>
  );
};
