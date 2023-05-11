import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  removeTodo: (id: number) => void;
  tempTodo: Todo | null;
  isDeleted: boolean;
};

export const TodoList: React.FC<Props> = React.memo(({
  todos, removeTodo, tempTodo, isDeleted,
}) => (
  <section className="todoapp__main">
    <TransitionGroup>
      {todos.map(todo => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <TodoItem
            todo={todo}
            key={todo.id}
            removeTodo={removeTodo}
            isTempTodo={false}
            isDeleted={isDeleted}
          />
        </CSSTransition>
      ))}
      {tempTodo && (
        <CSSTransition
          key={0}
          timeout={300}
          classNames="temp-item"
        >
          <TodoItem
            todo={tempTodo}
            isTempTodo
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
));
