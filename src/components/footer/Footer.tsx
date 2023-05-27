import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoFilter } from '../../types/TodoFilter';
import { deleteTodo } from '../../api/todos';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  filterBy: string,
  setFilterBy: (select: TodoFilter) => void,
  todoList: Todo[],
  setTodoList:(todos:Todo[]) => void,
  setError:(error: ErrorMessage) => void,
  setProcessings:(id: number | null) => void,
};

const { All, Active, Completed } = TodoFilter;

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
    const activeTodos = todoList.filter(todo => !todo.completed);
    const promises: Promise<unknown> [] = [];

    todoList.forEach(todo => {
      if (todo.completed) {
        setProcessings(todo.id);
        promises.push(deleteTodo(todo.id));
      }
    });
    Promise.all(promises)
      .then(() => setTodoList(activeTodos))
      .catch(() => setError(ErrorMessage.Delete));
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
          className={cn('filter__link', { selected: filterBy === Completed })}
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
