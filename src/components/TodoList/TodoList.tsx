import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import '../../styles/transitions.scss';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null,
  loading: boolean,
  deletedTodoId: number[],
  removeTodo: (id: number) => {},
};

export const TodoList: React.FC<Props> = ({
  todos, tempTodo, loading, deletedTodoId, removeTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => {
          return (
            <CSSTransition
              key={todo.id}
              timeout={100}
              classNames="item"
            >
              <TodoItem
                key={todo.id}
                todo={todo}
                loading={false}
                removeTodo={removeTodo}
                deletedTodoId={deletedTodoId}
              />
            </CSSTransition>
          );
        })}
        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={100}
            classNames="temp-item"
          >
            <TodoItem
              key={tempTodo.id}
              todo={tempTodo}
              loading={loading}
              removeTodo={removeTodo}
              deletedTodoId={deletedTodoId}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
