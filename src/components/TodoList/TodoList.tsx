import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  todoIdsToDelete: number[];
  onDelete: (id: number) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  todoIdsToDelete,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              isLoading={todoIdsToDelete.includes(todo.id)}
              onDelete={onDelete}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition timeout={300} classNames="item">
            <TodoItem todo={tempTodo} isLoading={true} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
