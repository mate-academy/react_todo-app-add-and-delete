import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

type Props = {
  todos: Todo[];
  removeTodo: (id: number) => void;
  tempTodo: Todo | null;
  isLoading?: boolean | string;
};

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  tempTodo,
  isLoading,
}) => {
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);

  const handleRemoveTodo = (id: number) => {
    setDeletingTodoId(id);
    removeTodo(id);
    setDeletingTodoId(id);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              key={todo.id}
              todo={todo}
              removeTodo={handleRemoveTodo}
              isLoading={
                (isLoading === 'deleting' && deletingTodoId === todo.id) ||
                (isLoading === 'completed' && todo.completed)
              }
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={tempTodo.id} timeout={300} classNames="item">
            <TodoItem
              todo={tempTodo}
              removeTodo={() => {}}
              isLoading={isLoading === 'adding'}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
