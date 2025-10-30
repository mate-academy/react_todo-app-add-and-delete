import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoInfo } from './TodoInfo';

interface TodoListProps {
  todos: Todo[];
  tempTodo: Todo | null;
  deletingTodoIds: number[];
  updatingTodoIds: number[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  deletingTodoIds,
  updatingTodoIds,
  onToggle,
  onDelete,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    <TransitionGroup>
      {todos.map(todo => {
        const isLoading =
          deletingTodoIds.includes(todo.id) ||
          updatingTodoIds.includes(todo.id);

        return (
          <CSSTransition key={todo.id} timeout={200} classNames="item">
            <TodoInfo
              todo={todo}
              onToggle={() => onToggle(todo.id)}
              onDelete={() => onDelete(todo.id)}
              isLoading={isLoading}
            />
          </CSSTransition>
        );
      })}

      {tempTodo && (
        <CSSTransition key={0} timeout={200} classNames="item">
          <TodoInfo
            todo={tempTodo}
            onToggle={() => {}}
            onDelete={() => {}}
            isLoading={true}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
