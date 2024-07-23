import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../Types/Todo';
import { Main } from './Main';

type Props = {
  handleCompletedStatus: (id: number) => void;
  onDelete: (id: number) => void;
  todos: Todo[];
  processingTodos: number[];
  tempTodo: Todo | null;
};

export const List: React.FC<Props> = ({
  handleCompletedStatus,
  onDelete,
  processingTodos,
  todos,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <Main
              todo={todo}
              onDelete={onDelete}
              isProcessed={processingTodos.includes(todo.id)}
              handleCompletedStatus={handleCompletedStatus}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="item">
            <Main
              todo={tempTodo}
              onDelete={onDelete}
              isProcessed={true}
              handleCompletedStatus={handleCompletedStatus}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
