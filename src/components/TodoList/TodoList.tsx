import React from 'react';

import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

import './TodoList.scss';

interface Props {
  todos: Todo[],
  tempTodo?: Todo | null,
  onDelete?: (todoId: number) => void,
  idsForLoader: number[],
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  idsForLoader,
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
            isLoading={idsForLoader.includes(todo.id)}
            onDelete={onDelete}
          />
        </CSSTransition>

      ))}
      {tempTodo && (
        <CSSTransition
          key={0}
          timeout={300}
          classNames="temp-item"
        >
          <TodoItem todo={tempTodo} />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
