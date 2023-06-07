import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todosAfterFilter: Todo[],
  handleDeletingTodo: (id: number) => void,
  tempTodo: Todo | null,
  todosForDeleting: number[]
};

export const TodoList: React.FC<Props> = ({
  todosAfterFilter,
  handleDeletingTodo,
  tempTodo,
  todosForDeleting,
}) => {
  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {
          todosAfterFilter
            .map(todo => (
              <CSSTransition
                key={todo.id}
                timeout={300}
                classNames="item"
              >
                <TodoItem
                  todo={todo}
                  key={todo.id}
                  handleDeletingTodo={handleDeletingTodo}
                  tempTodo={tempTodo}
                  todosForDeleting={todosForDeleting}
                />
              </CSSTransition>
            ))
        }

        {tempTodo?.id === 0 && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={tempTodo}
              key={tempTodo.id}
              tempTodo={tempTodo}
              todosForDeleting={todosForDeleting}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
