import React from 'react';

import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[],
  creating: Todo | null
  deletedId: number | null
  onDelete: (todoId: number) => void
}

export const TodoList: React.FC<Props> = ({
  todos, creating, onDelete, deletedId,
}) => {
  return (
    <section className="todoapp__main">
      <TransitionGroup>

        {todos.map(todo => {
          return (
            <CSSTransition
              key={todo.id}
              timeout={300}
              classNames="item"
            >
              <TodoItem
                todo={todo}
                onDelete={onDelete}
                deletedId={deletedId}
              />
            </CSSTransition>
          );
        })}

        {creating !== null
          && (
            <CSSTransition
              key={0}
              timeout={300}
              classNames="temp-item"
            >
              <TodoItem
                todo={creating}
                onDelete={onDelete}
                deletedId={deletedId}
              />
            </CSSTransition>
          )}
      </TransitionGroup>
    </section>
  );
};
