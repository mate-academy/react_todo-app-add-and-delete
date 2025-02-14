import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type HeaderProps = {
  todos: Todo[];
  query: string;
  counterCompletedTodos: number;
  isSubmitting: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  handleCompleteAllTodo: () => void;
  handleQueryChanged: (newValue: string) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export const Header: React.FC<HeaderProps> = ({
  todos,
  query,
  counterCompletedTodos,
  isSubmitting,
  inputRef,
  handleCompleteAllTodo,
  handleQueryChanged,
  handleSubmit,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: counterCompletedTodos === todos.length,
          })}
          data-cy="ToggleAllButton"
          onClick={handleCompleteAllTodo}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={query}
          onChange={event => {
            handleQueryChanged(event.target.value);
          }}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
