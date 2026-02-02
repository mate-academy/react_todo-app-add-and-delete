import React from 'react';
import { Todo } from '../../types/Todo';
import TodoItem from '../TodoItem/TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

interface Props {
  todos: Todo[];
  handleTodoToggle: (todoId: number) => void;
  handleTodoRemove: (todoId: number) => Promise<void>;
  deletingTodoIds?: number[];
  transitionTimeout: number;
}

const Todos = ({
  todos,
  handleTodoToggle,
  handleTodoRemove,
  deletingTodoIds = [],
  transitionTimeout,
}: Props) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={transitionTimeout}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              onToggle={handleTodoToggle}
              onTodoRemove={handleTodoRemove}
              isToDelete={deletingTodoIds.includes(todo.id)}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
};

export default React.memo(Todos);
