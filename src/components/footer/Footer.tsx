import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Select } from '../../types/Select';
import { deleteTodos } from '../../api/todos';
import { Error } from '../../types/Error';

type Props = {
  filterBy: string,
  setFilterBy: (select: Select) => void,
  todoList: Todo[],
  setTodoList:(todos:Todo[]) => void,
  setError:(error: Error) => void,
  setProcessings:(id: number | null) => void,
};

const { All, Active, Completed } = Select;

export const Footer: React.FC<Props> = ({
  filterBy,
  setFilterBy,
  todoList,
  setTodoList,
  setError,
  setProcessings,
}) => {
  const completedTodos = todoList
    .filter(todo => todo.completed).length;

  const leftItems = todoList.length - completedTodos;

  function onDeleteCompleted() {
    todoList.forEach(todo => {
      if (todo.completed) {
        setProcessings(todo.id);
        deleteTodos(todo.id)
          .then(() => {
            setTodoList(todoList.filter(item => !item.completed));
          })
          .catch(() => setError(Error.Delete));
      }
    });
  }

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${leftItems} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: filterBy === All })}
          onClick={() => setFilterBy(All)}
        >
          {All}
        </a>

        <a
          href="#/active"
          className={cn('filter__link',
            { selected: filterBy === Active })}
          onClick={() => setFilterBy(Active)}
        >
          {Active}
        </a>

        <a
          href="#/completed"
          className={cn('filter__link',
            { selected: filterBy === Completed })}
          onClick={() => setFilterBy(Completed)}
        >
          {Completed}
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={onDeleteCompleted}
      >
        {!completedTodos ? '' : 'Clear completed'}
      </button>
    </footer>
  );
};
