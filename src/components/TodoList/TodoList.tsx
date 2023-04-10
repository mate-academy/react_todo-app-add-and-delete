import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoElement } from '../TodoElement/TodoElement';

type Props = {
  todos: Todo[]
  tempTodo: Todo | null
  loadedIds: number[]
  removeTodo: (id: number) => void
  removeCompleted: () => void;
};

enum SortType {
  All,
  Active,
  Completed,
}

const sortTodos = (todos: Todo[], sortType: SortType): Todo[] => {
  switch (sortType) {
    case SortType.Active:
      return todos.filter(todo => !todo.completed);

    case SortType.Completed:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadedIds,
  removeTodo,
  removeCompleted,
}) => {
  const [sortType, setSortType] = useState(SortType.All);

  const visibleTodos = sortTodos(todos, sortType);
  const completedTodos = todos.filter(todo => todo.completed).length;
  const activeTodos = todos.filter(todo => !todo.completed);

  return (
    <>
      <section className="todoapp__main" data-cy="TodoList">
        {visibleTodos.map(todo => {
          const isLoading = loadedIds.some(id => id === todo.id);

          return (
            <TodoElement
              key={todo.id}
              todo={todo}
              isLoading={isLoading}
              removeTodo={removeTodo}
            />
          );
        })}
      </section>

      {tempTodo && (
        <TodoElement
          key={tempTodo.id}
          todo={tempTodo}
          isLoading
          removeTodo={() => {}}
        />
      )}

      <footer className="todoapp__footer">
        <span className="todo-count">
          {`${activeTodos.length} items left`}
        </span>

        <nav className="filter">
          <a
            href="#/"
            className={classNames('filter__link',
              { selected: sortType === SortType.All })}
            onClick={() => {
              if (SortType.All !== sortType) {
                setSortType(SortType.All);
              }
            }}
          >
            All
          </a>

          <a
            href="#/active"
            className={classNames('filter__link',
              { selected: sortType === SortType.Active })}
            onClick={() => {
              if (SortType.Active !== sortType) {
                setSortType(SortType.Active);
              }
            }}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={classNames('filter__link',
              { selected: sortType === SortType.Completed })}
            onClick={() => {
              if (SortType.Completed !== sortType) {
                setSortType(SortType.Completed);
              }
            }}
          >
            Completed
          </a>
        </nav>

        {!!completedTodos && (
          <button
            type="button"
            className="todoapp__clear-completed"
            onClick={removeCompleted}
          >
            Clear completed
          </button>
        )}
      </footer>
    </>
  );
};
