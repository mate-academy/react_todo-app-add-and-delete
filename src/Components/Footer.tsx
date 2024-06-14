import classNames from 'classnames';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  filteredButton: string;
  filterBy: (value: Filter) => void;
  setErrorMessage: (value: string) => void;
  setCompletedClearing: (value: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Footer: React.FC<Props> = ({
  todos,
  filteredButton,
  filterBy,
  setTodos,
  setErrorMessage,
  inputRef,
  setCompletedClearing,
}) => {
  const completedTodos = todos.filter(todo => todo.completed);
  const todosLeft = todos.length - completedTodos.length;

  const onDelete = (id: number) => {
    setCompletedClearing(true);
    deleteTodo(id)
      .then(() => {
        setTodos(todoState => todoState.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setCompletedClearing(false);
      });
  };

  const handleClearCompleted = async () => {
    completedTodos.forEach(todo => onDelete(todo.id));
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLeft} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filteredButton === 'all',
          })}
          onClick={() => filterBy('all')}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filteredButton === 'active',
          })}
          onClick={() => filterBy('active')}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filteredButton === 'completed',
          })}
          onClick={() => filterBy('completed')}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={completedTodos.length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
