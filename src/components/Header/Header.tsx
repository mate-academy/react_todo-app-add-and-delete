/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[]
  name: string,
  setName: (event: string) => void,
  handleAddTodo: (todoName: string) => void,
  isDisableInput: boolean,
};
export const Header:React.FC<Props> = ({
  todos,
  name,
  setName,
  handleAddTodo,
  isDisableInput,
}) => {
  const isActive = todos.filter(todo => !todo.completed).length > 0;
  const trimedName = name.trimStart();

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', { active: !isActive })}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={(event) => {
        event.preventDefault();
        handleAddTodo(name);
      }}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={trimedName}
          onChange={event => setName(event.target.value)}
          disabled={isDisableInput}
        />
      </form>
    </header>
  );
};
