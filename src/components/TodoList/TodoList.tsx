import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  deletingTodoIds?: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  deletingTodoIds,
}) => (
  <TransitionGroup component="ul" className="todo-list">
    {todos.map(todo => (
      <CSSTransition key={todo.id} timeout={300} classNames="item">
        <li>
          <TodoItem
            todo={todo}
            isSubmitting={deletingTodoIds?.includes(todo.id)}
            onDelete={onDelete}
          />
        </li>
      </CSSTransition>
    ))}
  </TransitionGroup>
);
