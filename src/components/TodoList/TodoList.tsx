import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[]
}

export const TodoList: React.FC<Props> = ({ todos }) => (
  <section className="todoapp__main" data-cy="TodoList">
    <TransitionGroup>
      {todos.map(todo => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <TodoItem todo={todo} />
        </CSSTransition>
      ))}
    </TransitionGroup>
  </section>
);
