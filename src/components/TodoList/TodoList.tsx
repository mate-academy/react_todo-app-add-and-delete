import React from 'react';
import './TodoList.css';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

interface Props {
  todos: Todo[];
  delTodo: number;
  isDelCompleted: boolean;
  tempTodo: Todo | null;
  onDelete: (todoID: number) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  delTodo,
  tempTodo,
  isDelCompleted,
  onDelete,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    <TransitionGroup>
      {todos.map(todo => (
        <CSSTransition key={todo.id} timeout={300} classNames="item">
          <TodoItem
            key={todo.id}
            todo={todo}
            delTodo={delTodo}
            isDelCompleted={isDelCompleted}
            isTempTodo={false}
            onDelete={onDelete}
          />
        </CSSTransition>
      ))}

      {tempTodo !== null && (
        <CSSTransition key={0} timeout={300} classNames="temp-item">
          <TodoItem todo={tempTodo} isTempTodo={true} onDelete={onDelete} />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
