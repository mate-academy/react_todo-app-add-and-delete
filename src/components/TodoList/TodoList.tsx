import React, { createRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';
import { StateSetter } from '../../types/StateSetter';

interface Props {
  visibleTodos: Todo[];
  setTodos: StateSetter<Todo[]>;
  setError: (msg: string, timeout?: number) => void;
  tempTodo: Todo | null;
  loadingIds: number[];
  addLoadingId: (postId: number) => void;
  removeLoadingId: (postId: number) => void;
}

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  setTodos,
  setError,
  tempTodo,
  loadingIds,
  addLoadingId,
  removeLoadingId,
}) => {
  const renderTodo = (todo: Todo, isTemp: boolean) => {
    const nodeRef = createRef<HTMLDivElement>();

    return (
      <CSSTransition
        key={todo.id}
        timeout={200}
        classNames={isTemp ? 'temp-item' : 'item'}
        nodeRef={nodeRef}
      >
        <TodoItem
          todo={todo}
          nodeRef={nodeRef}
          setTodos={setTodos}
          setError={setError}
          loadingIds={loadingIds}
          addLoadingId={addLoadingId}
          removeLoadingId={removeLoadingId}
        />
      </CSSTransition>
    );
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map((todo: Todo) => renderTodo(todo, false))}
        {tempTodo && renderTodo(tempTodo, true)}
      </TransitionGroup>
    </section>
  );
};
