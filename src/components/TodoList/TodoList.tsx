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
  isProcessedIDs: number[],
};

export const TodoList: React.FC<Props> = React.memo(
  ({
    todos,
    creating,
    onDelete,
    isProcessedIDs,
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
                isProcessedIDs={isProcessedIDs}
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
        {creating && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={creating}
              onDelete={onDelete}
              isProcessedIDs={isProcessedIDs}
            />
          </CSSTransition>
        )}
      </section>
    );
  },
);
