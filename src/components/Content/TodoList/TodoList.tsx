import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../../types/Todo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  isProcessed: number[];
  onUpdateTodo: (todoId: number, data: {}) => void;
  onDeleteTodo: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isProcessed,
  onUpdateTodo,
  onDeleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            classNames="item"
            timeout={300}
          >
            <TodoItem
              key={todo.id}
              todo={todo}
              isProcessed={isProcessed}
              onUpdateTodo={onUpdateTodo}
              onDeleteTodo={onDeleteTodo}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            classNames="temp-item"
            timeout={300}
          >
            <TodoItem
              todo={tempTodo}
              isProcessed={isProcessed}
              onUpdateTodo={onUpdateTodo}
              onDeleteTodo={onDeleteTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
