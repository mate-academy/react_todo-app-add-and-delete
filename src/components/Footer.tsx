import { Todo } from '../types/Todo';
import classNames from 'classnames';
import * as todosService from '../api/todos';
import { Status } from '../types/Status';

type Props = {
  onFilter: (filter: string) => void;
  onError: (error: string) => void;
  onTodos: (todos: Todo[]) => void;
  todos: Todo[];
  filter: string;
  focus: () => void;
};

export const Footer: React.FC<Props> = ({
  onFilter,
  onError,
  onTodos,
  todos,
  filter,
  focus,
}) => {
  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    onTodos((prevTodos: Todo[]) =>
      prevTodos.map(todo =>
        todo.completed ? { ...todo, isLoading: true } : todo,
      ),
    );

    const deletePromises = completedTodos.map(todo =>
      todosService
        .deleteTodo(todo.id)
        .then(() => ({ id: todo.id, success: true }))
        .catch(() => ({ id: todo.id, success: false })),
    );

    const results = await Promise.all(deletePromises);

    onTodos((prevTodos): Todo[] => {
      let updatedTodos = [...prevTodos];

      results.forEach(result => {
        if (result.success) {
          updatedTodos = updatedTodos.filter(todo => todo.id !== result.id);
        } else {
          updatedTodos = updatedTodos.map(todo =>
            todo.id === result.id ? { ...todo, isLoading: false } : todo,
          );
          onError('Unable to delete a todo');
        }
      });

      return updatedTodos;
    });

    focus();
  };

  const itemsLeft = todos.filter(todo => !todo.completed).length;

  return (
    <footer
      className={classNames('todoapp__footer', {
        hidden: todos.length === 0,
      })}
      data-cy="Footer"
    >
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(Status).map(status => {
          const isActive = filter === status;
          const filteLabel = Object.keys(Status).find(
            k => Status[k] === status,
          );

          return (
            <a
              key={status}
              href="#/"
              className={classNames('filter__link', {
                selected: isActive,
              })}
              data-cy={`FilterLink${filteLabel}`}
              onClick={() => onFilter(status)}
            >
              {filteLabel}
            </a>
          );
        })}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
        disabled={todos.filter(todo => todo.completed).length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
