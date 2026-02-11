import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TRANSITION_DURATION } from '../constants';

interface Props {
  todos: Todo[];
  onDelete: (id: number) => void;
  deletingIds: number[];
  tempTodo?: Partial<Todo> | null;
}

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  deletingIds,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={TRANSITION_DURATION}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              onDelete={onDelete}
              isLoading={deletingIds.includes(todo.id)}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={TRANSITION_DURATION}
            classNames="temp-item"
          >
            <TodoItem
              todo={tempTodo as Todo}
              onDelete={() => {}}
              isLoading={true}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
