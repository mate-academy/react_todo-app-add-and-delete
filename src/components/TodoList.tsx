import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteTodo: (id: number) => void;
  deletingTodoId: number | null;
};

export const TodoList: React.FC<Props> = React.memo(
  ({ todos, tempTodo, deleteTodo, deletingTodoId }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        <TransitionGroup>
          {todos.map(({ title, completed, id }) => (
            <CSSTransition key={id} timeout={300} classNames="item">
              <TodoItem
                title={title}
                completed={completed}
                id={id}
                key={id}
                deleteTodo={deleteTodo}
                isLoading={deletingTodoId === id}
              />
            </CSSTransition>
          ))}

          {tempTodo && (
            <CSSTransition
              key={tempTodo.id}
              timeout={300}
              classNames="temp-item"
            >
              <TodoItem
                title={tempTodo?.title}
                completed={false}
                id={tempTodo.id}
                deleteTodo={deleteTodo}
                isLoading
              />
            </CSSTransition>
          )}
        </TransitionGroup>
      </section>
    );
  },
);

TodoList.displayName = 'TodoList';
