import classNames from 'classnames';
import { FilterType } from '../types/Filter';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';

type Props = {
  todos: Todo[],
  setTodos : (todos: Todo[]) => void,
  filterType: FilterType,
  setFilterType: (type: FilterType) => void,
};

export const TodosFooter: React.FC<Props> = ({
  todos, filterType, setFilterType, setTodos,
}) => {
  return (
    <>
      {todos.length > 0 && (
        <footer className="todoapp__footer">
          <span className="todo-count" data-cy="todosCounter">
            {`${todos.filter((todo) => !todo.completed).length} items left`}
          </span>

          <nav className="filter">
            <a
              href="#/"
              className={classNames('filter__link', {
                selected: filterType === FilterType.NONE,
              })}
              onClick={(e) => {
                e.preventDefault();
                setFilterType(FilterType.NONE);
              }}
            >
              All
            </a>

            <a
              href="#/active"
              className={classNames('filter__link', {
                selected: filterType === FilterType.ACTIVE,
              })}
              onClick={(e) => {
                e.preventDefault();
                setFilterType(FilterType.ACTIVE);
              }}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={classNames('filter__link', {
                selected: filterType === FilterType.COMPLETED,
              })}
              onClick={(e) => {
                e.preventDefault();
                setFilterType(FilterType.COMPLETED);
              }}
            >
              Completed
            </a>
          </nav>

          {todos.some((todo) => todo.completed) && (
            <button
              type="button"
              className="todoapp__clear-completed"
              onClick={() => {
                todos.map((item) => {
                  if (item.completed) {
                    return (
                      deleteTodo(item.id)
                        .then(() => {
                          setTodos(todos.filter((todo) => !todo.completed));
                        })
                    );
                  }

                  return item;
                });
              }}
            >
              Clear completed
            </button>
          )}
        </footer>
      )}
    </>
  );
};
