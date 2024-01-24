import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  deleteTodo: (todoId: number) => void;
  selectedId: number;
  isLoadingCompleted: boolean;
  tempTodo: Todo | null;
  isLoading: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  selectedId,
  isLoadingCompleted,
  tempTodo,
  isLoading,
}) => {
  return (
    <TransitionGroup>
      {todos.map((todo) => (
        <CSSTransition key={todo.id} timeout={300} classNames="item">
          <TodoItem
            key={todo.id}
            todo={todo}
            deleteTodo={deleteTodo}
            selectedId={selectedId}
            isLoadingCompleted={isLoadingCompleted}
          />
        </CSSTransition>
      ))}

      {tempTodo !== null && (
        <CSSTransition key={0} timeout={300} classNames="temp-item">
          <TodoItem
            key={tempTodo.id}
            todo={tempTodo}
            selectedId={selectedId}
            isLoading={isLoading}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  );
};
