import { FC, useMemo, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './TodoList.scss';

import { Todo, StatusFilter } from '../../types';
import { filterTodos } from '../../utils';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  loadingTodoIds: number[];
  tempTodo: Todo | null;
  statusFilter: StatusFilter;
  onDeleteTodo: (todoId: Todo['id']) => void;
}

export const TodoList: FC<Props> = ({
  todos,
  loadingTodoIds,
  tempTodo,
  statusFilter,
  onDeleteTodo,
}) => {
  const [editingTodo] = useState<Todo | null>(null);

  const visibleTodos = useMemo(
    () => filterTodos(todos, statusFilter),
    [todos, statusFilter],
  );

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map(todo => {
          const isCurrentTodoBeingEditing = editingTodo?.id === todo.id;
          const isCurrentTodoLoading = loadingTodoIds.includes(todo.id);

          return (
            <CSSTransition key={todo.id} timeout={300} classNames="item" appear>
              <TodoItem
                todo={todo}
                isLoading={isCurrentTodoLoading}
                isBeingEditing={isCurrentTodoBeingEditing}
                onDeleteTodo={onDeleteTodo}
              />
            </CSSTransition>
          );
        })}

        {tempTodo && (
          <CSSTransition key={tempTodo.id} timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} isLoading={true} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
