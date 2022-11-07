import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  isAdding: boolean;
  tempTodo: Todo;
  todoIdsToRemove: number[];
  filtredTodos: Todo[];
  removeTodoFromServer: (id: number) => void;
}

export const TodoList: React.FC<Props> = React.memo(({
  filtredTodos,
  isAdding,
  tempTodo,
  todoIdsToRemove,
  removeTodoFromServer,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    <TransitionGroup>
      {filtredTodos.map((todo) => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <TodoItem
            todo={todo}
            key={todo.id}
            removeTodoFromServer={removeTodoFromServer}
            isLoading={todoIdsToRemove.includes(todo.id)}
          />
        </CSSTransition>
      ))}
      {isAdding && (
        <CSSTransition
          key={tempTodo.id}
          timeout={300}
          classNames="item"
        >
          <TodoItem
            todo={tempTodo}
            isLoading={isAdding}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
));
