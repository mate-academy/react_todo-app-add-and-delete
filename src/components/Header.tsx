import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  textTodo: string;
  todos:Todo[];
  handleSubmit: (event: { preventDefault: () => void }) => void;
  setTextTodo: (text:string) => void;
  statusResponse:boolean;
};

export const Header:React.FC<Props> = ({
  textTodo,
  setTextTodo,
  todos,
  statusResponse,
  handleSubmit,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all', { active: todos.length },
          )}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          disabled={statusResponse}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={textTodo}
          onChange={(event) => {
            setTextTodo(event.target.value);
          }}
          ref={(input) => input && input.focus()}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
      </form>
    </header>
  );
};
