import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoElement } from '../TodoElement';

enum FilterType {
  All,
  Active,
  Completed,
}

type Props = {
  todos: Todo[];
  tempTodo: Todo | undefined;
  onDelete: (id: number) => void;
  loadingIds: number[];
  onDeleteCompleted: () => void;
};

const getTodos = (todos: Todo[], filterMethod: FilterType): Todo[] => {
  switch (filterMethod) {
    case FilterType.Active:
      return todos.filter(todo => !todo.completed);

    case FilterType.Completed:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  loadingIds,
  onDeleteCompleted,
}) => {
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);

  const visibleTodos = getTodos(todos, filterType);

  const remainingTodos = todos.filter(todo => !todo.completed).length;

  const completedTodos = todos.filter(todo => todo.completed).length;

  return (
    <>
      <section className="todoapp__main">
        {visibleTodos.map(todo => {
          const isLoading = loadingIds.some(id => id === todo.id);

          return (
            <TodoElement
              todo={todo}
              key={todo.id}
              onDelete={onDelete}
              isLoading={isLoading}
            />
          );
        })}
      </section>

      {tempTodo && (
        <TodoElement
          todo={tempTodo}
          key={tempTodo.id}
          onDelete={() => {}}
          isLoading
        />
      )}

      <footer className="todoapp__footer">
        <span className="todo-count">
          {`${remainingTodos} ${remainingTodos === 1 ? 'item' : 'items'} left`}
        </span>

        {/* Active filter should have a 'selected' class */}
        <nav className="filter">
          <a
            href="#/"
            className={classNames(
              'filter__link',
              {
                selected: filterType === FilterType.All,
              },
            )}
            onClick={() => {
              if (filterType !== FilterType.All) {
                setFilterType(FilterType.All);
              }
            }}
          >
            All
          </a>

          <a
            href="#/active"
            className={classNames(
              'filter__link',
              {
                selected: filterType === FilterType.Active,
              },
            )}
            onClick={() => {
              if (filterType !== FilterType.Active) {
                setFilterType(FilterType.Active);
              }
            }}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={classNames(
              'filter__link',
              {
                selected: filterType === FilterType.Completed,
              },
            )}
            onClick={() => {
              if (filterType !== FilterType.Completed) {
                setFilterType(FilterType.Completed);
              }
            }}
          >
            Completed
          </a>
        </nav>

        {completedTodos > 0 && (
          <button
            type="button"
            className="todoapp__clear-completed"
            onClick={onDeleteCompleted}
          >
            Clear completed
          </button>
        )}
      </footer>
    </>
  );
};
