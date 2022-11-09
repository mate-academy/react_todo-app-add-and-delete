import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodosFilter } from '../../types/TodoFilter';
import { client } from '../../utils/fetchClient';

type Todos = {
  todos: Todo[]
  filterType: TodosFilter
  todosFiltration: (filterType: TodosFilter) => void
  todosUpdate: () => void
};

export const TodoFooter: React.FC<Todos> = ({
  todos,
  filterType,
  todosFiltration,
  todosUpdate,
}) => {
  const completedTodo = todos.some(todo => todo.completed === true);
  const activeTodosLeft = todos.filter(todo => todo.completed === false).length;
  const filtrationButtonAll = () => todosFiltration(TodosFilter.all);
  const filtrationButtonActive = () => todosFiltration(TodosFilter.active);
  const filtrationButtonCompleted = () => (
    todosFiltration(TodosFilter.completed)
  );

  const clearCompletedButton = async () => {
    todos.filter(todo => todo.completed === true)
      .forEach(todo => {
        client.delete(`/todos/${todo.id}`);
      });

    setTimeout(() => {
      todosUpdate();
    }, 300);
  };

  return (
    <>
      {todos.length > 0 && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="todosCounter">
            {`${activeTodosLeft} items left`}
          </span>

          <nav className="filter" data-cy="Filter">
            <a
              data-cy="FilterLinkAll"
              href="#/"
              className={classNames('filter__link', {
                selected: filterType === TodosFilter.all,
              })}
              onClick={filtrationButtonAll}
            >
              All
            </a>

            <a
              data-cy="FilterLinkActive"
              href="#/active"
              className={classNames('filter__link', {
                selected: filterType === TodosFilter.active,
              })}
              onClick={filtrationButtonActive}
            >
              Active
            </a>
            <a
              data-cy="FilterLinkCompleted"
              href="#/completed"
              className={classNames('filter__link', {
                selected: filterType === TodosFilter.completed,
              })}
              onClick={filtrationButtonCompleted}
            >
              Completed
            </a>
          </nav>
          <button
            data-cy="ClearCompletedButton"
            type="button"
            className={classNames('todoapp__clear-completed', {
              'todoapp__clear--hidden': !completedTodo,
            })}
            onClick={clearCompletedButton}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
