import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

interface TodoListProps {
  preparedTodos: Todo[];
  processingTodos: number[];
  tempTodo: Todo | null;
  removeTodo: (id: number) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  preparedTodos,
  processingTodos,
  tempTodo,
  removeTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {preparedTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              isActive={processingTodos.includes(todo.id)}
              removeTodo={() => removeTodo(todo.id)}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} isActive={true} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
