import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  allTodos: Todo[],
  activeTodos: Todo[],
  title: string;
  isAdding: boolean;
  setTitle: (value: string) => void;
  addTodoHandler: () => void;
  completeAll: () => void;
};

/* eslint-disable jsx-a11y/control-has-associated-label */
export const Header: React.FC<Props> = ({
  allTodos,
  activeTodos,
  title,
  isAdding,
  setTitle,
  addTodoHandler,
  completeAll,
}) => {
  const enterKeyHandler = (key: string) => {
    if (key === 'Enter') {
      addTodoHandler();
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all', { active: activeTodos.length === 0 },
        )}
        style={{ opacity: +Boolean(allTodos.length) }}
        onClick={completeAll}
      />
      <form onSubmit={e => e.preventDefault()}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isAdding}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onKeyUp={e => enterKeyHandler(e.key)}
        />
      </form>
    </header>
  );
};
