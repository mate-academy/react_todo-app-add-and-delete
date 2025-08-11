import classNames from 'classnames';
import { Todo } from './types/Todo';

type Props = {
  value: string;
  todos: Todo[];
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  titleField: React.RefObject<HTMLInputElement>;
  isLoading: boolean;
  toggleAll: () => void;
};

export const Header: React.FC<Props> = ({
  value,
  todos,
  handleSubmit,
  setValue,
  titleField,
  isLoading,
  toggleAll,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(x => x.completed === true),
          })}
          data-cy="ToggleAllButton"
          onClick={() => toggleAll()}
        />
      )}

      <form onSubmit={e => handleSubmit(e)}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          onChange={e => setValue(e.target.value)}
          ref={titleField}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};