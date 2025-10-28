import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

interface TodoListProps {
  todos: Todo[];
  isLoading?: boolean;
  tempTodo?: Todo | null;
  onDelete: (todoId: Todo['id']) => void;
  deletingTodos: Todo['id'][] | null;
}
export const TodoList: React.FC<TodoListProps> = ({
  todos,
  isLoading = false,
  tempTodo,
  onDelete,
  deletingTodos,
}) => {
  const refForTmpTodo = React.createRef<HTMLDivElement>();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => {
          const nodeRef = React.createRef<HTMLDivElement>();

          return (
            <CSSTransition
              key={todo.id}
              timeout={300}
              classNames="item"
              nodeRef={nodeRef}
            >
              <TodoInfo
                todo={todo}
                ref={nodeRef}
                onDelete={onDelete}
                deletingTodos={deletingTodos}
              />
            </CSSTransition>
          );
        })}
        {isLoading && tempTodo && (
          <CSSTransition
            key={tempTodo.id}
            timeout={300}
            classNames="temp-item"
            nodeRef={refForTmpTodo}
          >
            <TodoInfo
              todo={tempTodo}
              ref={refForTmpTodo}
              isLoading={isLoading}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
