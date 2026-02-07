import React from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  prepareTodos: () => Todo[];
  deletedId: number[];
  tempTodo: Todo | null;
  handleDelete: (id: number) => Promise<number>;
};

export const TodoList: React.FC<Props> = ({
  prepareTodos,
  handleDelete,
  deletedId,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {prepareTodos().map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              key={todo.id}
              title={todo.title}
              completed={todo.completed}
              isLoading={false}
              deletedId={deletedId}
              id={todo.id}
              handleDelete={() => handleDelete(todo.id)}
            />
          </CSSTransition>
        ))}
        {!!tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem
              title={tempTodo.title}
              completed={tempTodo.completed}
              isLoading={true}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
