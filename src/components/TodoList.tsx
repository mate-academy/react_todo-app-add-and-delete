import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  todos: Todo[];
  tempTodo?: Todo | null;
  isLoading?: boolean;
  pendingIds?: number[];
  onDelete?: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo = null,
  isLoading = false,
  pendingIds = [],
  onDelete = () => {},
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    <TransitionGroup>
      {[...todos, ...(tempTodo ? [tempTodo] : [])].map(todo => {
        const isTemp = todo.id === 0;
        const isPending = pendingIds.includes(todo.id);

        return (
          <CSSTransition
            key={isTemp ? 'temp' : todo.id}
            timeout={300}
            classNames={isTemp ? 'temp-item' : 'item'}
          >
            <TodoItem
              todo={todo}
              isLoading={isLoading}
              isPending={isTemp || isPending}
              onDelete={onDelete}
            />
          </CSSTransition>
        );
      })}
    </TransitionGroup>
  </section>
);
