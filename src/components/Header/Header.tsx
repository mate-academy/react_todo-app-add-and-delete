import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  titleField: React.RefObject<HTMLInputElement>;
  todoTitle: string;
  handleInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
};

export const Header: React.FC<Props> = ({
  todos,
  handleSubmit,
  handleInput,
  titleField,
  todoTitle,
  loading,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        data-cy="ToggleAllButton"
        className={classNames('todoapp__toggle-all', {
          active: todos.some(todo => todo.completed),
        })}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleField}
          value={todoTitle}
          onChange={handleInput}
          disabled={loading}
        />
      </form>
    </header>
  );
};
