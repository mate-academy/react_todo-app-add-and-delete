import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  visibleTodos: Todo[];
  onDelete: (todoId: number) => void;
  selectedTodo: number | null;
  completedTodosIds: number[];
  creating: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  onDelete,
  selectedTodo,
  creating,
  completedTodosIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
            appear={true}
          >
            <TodoItem
              todo={todo}
              isProcessed={
                completedTodosIds?.includes(todo.id) || selectedTodo === todo.id
              }
              onDelete={() => onDelete(todo.id)}
            />
          </CSSTransition>
        ))}

        {creating && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
            appear={true}
          >
            <TodoItem todo={creating} isProcessed={true} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
