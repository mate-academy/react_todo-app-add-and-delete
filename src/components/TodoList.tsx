/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoItem } from '../components/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  processing: number[];
  onDelete: (todoId: number) => Promise<void>;
};

export const TodoList: React.FC<Props> = React.memo(function TodoList({
  todos,
  tempTodo,
  processing,
  onDelete,
}) {
  const tempNode = React.createRef<HTMLDivElement>();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => {
          const nodeRef = React.createRef<HTMLDivElement>();

          return (
            <CSSTransition
              nodeRef={nodeRef}
              key={todo.id}
              timeout={1000}
              classNames="item"
            >
              <TodoItem
                key={todo.id}
                todo={todo}
                onRemoveTodo={() => onDelete(todo.id)}
                isLoading={processing.includes(todo.id)}
              />
            </CSSTransition>
          );
        })}

        {tempTodo && (
          <CSSTransition
            nodeRef={tempNode}
            timeout={1000}
            classNames="temp-item"
          >
            <TodoItem
              nodeRef={tempNode}
              todo={tempTodo}
              isLoading={true}
              onRemoveTodo={async () => Promise.resolve()}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
});
