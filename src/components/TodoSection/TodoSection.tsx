import React, { useContext, useMemo } from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/SortType';
import { FilterContext } from '../../context/FilterContext';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  loadingId: number[],
  tempTodo: Todo | null,
  onRemove: (todoId: number) => void,
};

const getVisibleTodos = (filter: FilterType, allTodos: Todo[]) => {
  switch (filter) {
    case FilterType.ACTIVE:
      return allTodos.filter(todo => todo.completed === false);

    case FilterType.COMPLETED:
      return allTodos.filter(todo => todo.completed === true);

    default:
      return allTodos;
  }
};

export const TodoSection: React.FC<Props> = React.memo(
  ({
    todos,
    loadingId,
    tempTodo,
    onRemove,
  }) => {
    const { filter } = useContext(FilterContext);

    const visbleTodos = useMemo(() => (
      getVisibleTodos(filter, todos)
    ), [filter, todos]);

    return (
      <section className="todoapp__main">
        <TransitionGroup>
          {visbleTodos.map(todo => (
            <CSSTransition
              key={todo.id}
              timeout={300}
              classNames="item"
            >
              <TodoItem
                todo={todo}
                loadingId={loadingId}
                key={todo.id}
                onRemove={onRemove}
              />
            </CSSTransition>
          ))}

          {tempTodo && (
            <CSSTransition
              key={0}
              timeout={300}
              classNames="temp-item"
            >
              <TodoItem
                todo={tempTodo}
                loadingId={loadingId}
                onRemove={onRemove}
              />
            </CSSTransition>
          )}
        </TransitionGroup>
      </section>
    );
  },
);
