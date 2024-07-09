import React from 'react';
import { Todo as TodoType } from '../types/Todo';
import { Todo } from './Todo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  todos: TodoType[];
  tempTodo: TodoType | null;
  onDelete: (id: number) => void;
  processingTodos: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  processingTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <Todo
              todo={todo}
              onDelete={onDelete}
              isProcessed={processingTodos.includes(todo.id)}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="item">
            <Todo todo={tempTodo} onDelete={onDelete} isProcessed={true} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
