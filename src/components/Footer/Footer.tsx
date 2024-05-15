import { useContext, FC } from 'react';
import { StatusSelect } from '../../types/Todo';
import { AppContext } from '../../wrappers/AppProvider';
import './Footer.scss';
import { deleteTodos } from '../../helpers';

export const Footer: FC = () => {
  const {
    todos,
    setTodos,
    setStatus,
    status,
    setErrorType,
    setTodoDeleteId,
    inputRef,
  } = useContext(AppContext);

  const activeTodo = todos.reduce(
    (acc, current) => (current.completed ? acc : acc + 1),
    0,
  );

  const someCompletedTodos = todos.some(todo => todo.completed);

  const onDeleteAllCompleted = async () => {
    try {
      const allCompleted = todos.filter(el => el.completed);

      const idToDelete = allCompleted.map(el => el.id);

      setTodoDeleteId(idToDelete);

      await Promise.all(
        allCompleted.map(async todo => {
          try {
            await deleteTodos(todo.id);

            setTodos(prevState => prevState.filter(el => el.id !== todo.id));
          } catch (err) {
            setErrorType('delete');
          }
        }),
      );

      inputRef.current?.focus();
    } finally {
      setTodoDeleteId(null);
    }
  };

  if (!todos.length) {
    return null;
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodo} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${
            status === StatusSelect.All ? 'selected' : ''
          }`}
          data-cy="FilterLinkAll"
          onClick={() => setStatus(StatusSelect.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${
            status === StatusSelect.Active ? 'selected' : ''
          }`}
          data-cy="FilterLinkActive"
          onClick={() => setStatus(StatusSelect.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${
            status === StatusSelect.Completed ? 'selected' : ''
          }`}
          data-cy="FilterLinkCompleted"
          onClick={() => setStatus(StatusSelect.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!someCompletedTodos}
        onClick={onDeleteAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
