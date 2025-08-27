import { useMemo, useState } from 'react';
import { Todo } from '../types/Todo';
import TodoItem from './TodoItem';
import classNames from 'classnames';
import { deleteTodo } from '../api/todos';
import { Errors } from '../types/Error';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  handleDelete: (id: number | number[]) => void;
  handleTodoError: (message: Errors | null) => void;
  onSetLoading: (ids: number[]) => void;
  loadingIds: number[];
};
enum Filters {
  All,
  Active,
  Completed,
}
function TodoMain({
  todos,
  tempTodo,
  handleDelete,
  handleTodoError,
  loadingIds,
  onSetLoading,
}: Props) {
  const [filter, setFilter] = useState<Filters>(Filters.All);
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filters.Active: {
        return todos.filter(todo => !todo.completed);
      }
      case Filters.Completed: {
        return todos.filter(todo => todo.completed);
      }
      case Filters.All:
      default:
        return todos;
    }
  }, [filter, todos]);
  const isAnyCompleted = todos.some(todo => todo.completed);
  const activeTodos = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );
  const handleChangeFilter = (value: Filters) => {
    if (value !== filter) {
      setFilter(value);
    }
  };

  async function handleClearTodos() {
    const completedTodos = todos.filter(todo => todo.completed);
    onSetLoading(completedTodos.map(todo => todo.id));

    const res = await Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id)),
    );
    const successfulIndexes: number[] = res.reduce<number[]>(
      (acc, curr, ind) => {
        if (curr.status === 'fulfilled') {
          acc.push(completedTodos[ind].id);
        }
        return acc;
      },
      [],
    );
    handleDelete(successfulIndexes);

    const isFailed = res.some(req => req.status === 'rejected');

    if (isFailed) {
      handleTodoError(Errors.DeleteTodo);
    }

    onSetLoading([]);
  }

  return (
    <>
      <section className="todoapp__main" data-cy="TodoList">
        {filteredTodos.length > 0 && (
          <>
            {filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={handleDelete}
                onError={handleTodoError}
                isPending={loadingIds.includes(todo.id)}
                onSetLoading={onSetLoading}
              />
            ))}
            {tempTodo && (
              <TodoItem
                key={tempTodo.id}
                todo={tempTodo}
                isPending={loadingIds.includes(tempTodo.id)}
                onDelete={handleDelete}
                onError={handleTodoError}
                onSetLoading={onSetLoading}
              />
            )}
          </>
        )}
      </section>
      {todos.length > 0 && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {activeTodos} items left
          </span>

          <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              className={classNames('filter__link', {
                selected: filter === Filters.All,
              })}
              data-cy="FilterLinkAll"
              onClick={() => handleChangeFilter(Filters.All)}
            >
              All
            </a>

            <a
              href="#/active"
              className={classNames('filter__link', {
                selected: filter === Filters.Active,
              })}
              data-cy="FilterLinkActive"
              onClick={() => handleChangeFilter(Filters.Active)}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={classNames('filter__link', {
                selected: filter === Filters.Completed,
              })}
              data-cy="FilterLinkCompleted"
              onClick={() => handleChangeFilter(Filters.Completed)}
            >
              Completed
            </a>
          </nav>

          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            disabled={!isAnyCompleted}
            onClick={handleClearTodos}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
}

export default TodoMain;
