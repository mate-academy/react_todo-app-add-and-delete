import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  creating: Todo | null,
  onDelete: (todoId: number) => void,
  inProcessing: number[],
};

export const TodoList: React.FC<Props> = React.memo(
  ({
    todos,
    creating,
    onDelete,
    inProcessing,
  }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        <TransitionGroup>
          {todos.map(todo => (
            <CSSTransition
              key={todo.id}
              timeout={300}
              classNames="item"
            >
              <TodoItem
                todo={todo}
                onDelete={onDelete}
                isProcessedIDs={inProcessing.includes(todo.id)}
              />
            </CSSTransition>
          ))}

          {creating && (
            <CSSTransition
              key={0}
              timeout={300}
              classNames="temp-item"
            >
              <TodoItem
                todo={creating}
                onDelete={onDelete}
                isProcessedIDs
              />
            </CSSTransition>
          )}
        </TransitionGroup>
      </section>
    );
  },
);
