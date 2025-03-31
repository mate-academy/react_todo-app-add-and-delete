import { FC } from 'react';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';
import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import './todoTransition.css';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  isTempTodoCreating: boolean;
  handleDelete: (id: number) => void;
  deletingTodoIds: number[];
  isLoading: boolean;
}

export const TodoList: FC<Props> = ({
  todos,
  tempTodo,
  isTempTodoCreating,
  handleDelete,
  deletingTodoIds,
  isLoading,
}: Props) => (
  <section className="todoapp__main" data-cy="TodoList">
    <TransitionGroup>
      {todos?.map(todo => (
        <CSSTransition key={todo.id} timeout={300} classNames="item">
          <TodoItem
            key={todo.id}
            todo={todo}
            isLoading={isLoading}
            handleDelete={handleDelete}
            isDeleting={deletingTodoIds.includes(todo.id)}
          />
        </CSSTransition>
      ))}

      {tempTodo && (
        <CSSTransition key={0} timeout={300} classNames="temp-item">
          <TodoItem
            key="temp"
            todo={tempTodo}
            isLoading={isTempTodoCreating}
            handleDelete={handleDelete}
            isDeleting={deletingTodoIds.includes(tempTodo.id)}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
