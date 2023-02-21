import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  visibleTodos: Todo[],
  tempTodo: Todo | null,
  todosLoadingState: Todo[],
  onClickRemoveTodo: (todoId: Todo) => void,
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  todosLoadingState,
  onClickRemoveTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              todosLoadingState={todosLoadingState}
              onClickRemoveTodo={onClickRemoveTodo}
            />
          </CSSTransition>
        ))}
        {tempTodo !== null && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={tempTodo}
              todosLoadingState={todosLoadingState}
              onClickRemoveTodo={() => { }}
            />
          </CSSTransition>

        )}
      </TransitionGroup>
    </section>
  );
};
