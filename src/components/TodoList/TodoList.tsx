/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  isSubmitting: boolean;
  submittingTodoIds: number[];
  handleDeleteTodo: (todoId: number) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  isSubmitting,
  submittingTodoIds,
  handleDeleteTodo,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    <TransitionGroup>
      {todos.map(todo => (
        <CSSTransition key={todo.id} timeout={300} classNames="item">
          <TodoItem
            todo={todo}
            isSubmitting={submittingTodoIds.includes(todo.id)}
            onDeleteTodo={handleDeleteTodo}
          />
        </CSSTransition>
      ))}
      {tempTodo && (
        <CSSTransition key={tempTodo.id} timeout={300} classNames="temp-item">
          <TodoItem todo={tempTodo} isSubmitting={isSubmitting} />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
