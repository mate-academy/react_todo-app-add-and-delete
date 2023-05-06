import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import '../../styles/animation.scss';
import { TodoElement } from '../TodoElement';

import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[]
  handleRemove: (id: number) => void;
  tempTodo: Todo | null;
  processedIds: number[];
}

export const TodosList: React.FC<Props> = ({
  todos,
  handleRemove,
  tempTodo,
  processedIds,
}) => {
  return (
    <ul className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos?.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoElement
              todo={todo}
              key={todo.id}
              handleRemove={handleRemove}
              processedIds={processedIds}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoElement
              todo={tempTodo}
              handleRemove={handleRemove}
              processedIds={processedIds}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </ul>
  );
};
