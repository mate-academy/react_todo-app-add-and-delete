import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface HeaderProps {
  todoInput: string;
  disableInput: boolean;
  setTodoInput: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLInputElement>;
  addTodos: (e: React.FormEvent) => void;
  todos: Todo[];
}

const Header: React.FC<HeaderProps> = ({
  todoInput,
  disableInput,
  setTodoInput,
  addTodos,
  inputRef,
  todos,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
      />
      <form onSubmit={addTodos}>
        <input
          autoFocus
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={e => setTodoInput(e.target.value)}
          value={todoInput}
          disabled={disableInput}
          ref={inputRef}
        />
      </form>
    </header>
  );
};

export default Header;
