import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  loading: boolean;
  deleteTodoItem: (id: number) => void;
  deletingId: number | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loading,
  deleteTodoItem,
  deletingId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {loading ? (
        <div className="loader-container">
          <div className="loader" />
        </div>
      ) : (
        <TransitionGroup>
          {todos.map(todo => (
            <CSSTransition key={todo.id} timeout={300} classNames="item">
              <TodoItem
                todo={todo}
                loading={todo.id === -1 || todo.id === deletingId}
                deleteTodoItem={deleteTodoItem}
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
      )}
    </section>
  );
};
