import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  processingIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  processingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
            appear={true}
          >
            <TodoItem
              todo={todo}
              key={todo.id}
              onTodoRemove={onDelete}
              isLoading={processingIds.includes(todo.id)}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
            appear={true}
          >
            <TodoItem todo={tempTodo} isLoading={true} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
