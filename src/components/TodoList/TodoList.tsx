/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loading: number[];
  handleDeleteTodo: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loading,
  handleDeleteTodo,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    <TransitionGroup>
      {todos.map(todo => (
        <CSSTransition key={todo.id} timeout={300} classNames="item">
          <TodoItem
            todo={todo}
            loading={loading}
            handleDeleteTodo={handleDeleteTodo}
          />
        </CSSTransition>
      ))}
      {tempTodo && (
        <CSSTransition key={tempTodo.id} timeout={300} classNames="temp-item">
          <TodoItem
            todo={tempTodo}
            loading={loading}
            handleDeleteTodo={handleDeleteTodo}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
