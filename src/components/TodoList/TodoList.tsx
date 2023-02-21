import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import '../../styles/transitions.scss';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  handleDeleteTodo: (todoId: number) => void;
  activeTodosId: number[];
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  tempTodo,
  handleDeleteTodo,
  activeTodosId,
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
            key={todo.id}
            todo={todo}
            handleDeleteTodo={handleDeleteTodo}
            isLoading={activeTodosId.includes(todo.id)}
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
            handleDeleteTodo={handleDeleteTodo}
            isLoading
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
));
