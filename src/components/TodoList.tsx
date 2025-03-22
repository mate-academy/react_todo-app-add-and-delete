import React from 'react';
import { Todo } from '../types/Todo';
import { TodoInfo } from './TodoInfo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadTodos: number[];
  onLoadTodos: (loadTodos: number[]) => void;
  onDelete?: (todoId: number) => void;
  onError?: (error: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadTodos,
  onLoadTodos,
  onDelete = () => {},
  onError = () => {},
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoInfo
              todo={todo}
              key={todo.id}
              loadTodos={loadTodos}
              onLoad={onLoadTodos}
              onDelete={onDelete}
              onError={onError}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoInfo
              todo={tempTodo}
              key={0}
              loadTodos={loadTodos}
              onLoad={onLoadTodos}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
