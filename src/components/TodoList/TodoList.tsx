import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo;
  isAdding: boolean;
  processings: number[];
  onDelete: (id: number) => void;
};

export const TodoList: React.FC<Props> = React.memo(({
  todos, tempTodo, isAdding, processings, onDelete,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
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
            isProcessed={processings.includes(todo.id)}
            onDelete={onDelete}
          />
        </CSSTransition>
      ))}

      {isAdding && (
        <CSSTransition
          key={0}
          timeout={300}
          classNames="temp-item"
        >
          <TodoItem
            todo={tempTodo}
            key={tempTodo.id}
            isProcessed
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
));
