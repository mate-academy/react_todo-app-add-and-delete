import React from 'react';
import '../../styles/transitions.scss';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  onRemove: (todoId: number) => void,
  loadingTodo: number[]
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onRemove,
  loadingTodo,
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
            onRemoveTodo={onRemove}
            loadingTodo={loadingTodo}
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
            onRemoveTodo={onRemove}
            loadingTodo={loadingTodo}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
