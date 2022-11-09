import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

import '../../styles/transitiongroup.scss';

type Props = {
  todos: Todo[];
  isAdding: boolean;
  selectedTodosIds: number[];
  newTitle: string,
  onDelete: (id: number[]) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  isAdding,
  selectedTodosIds,
  newTitle,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              selectedTodosIds={selectedTodosIds}
              onDelete={onDelete}
            />
          </CSSTransition>
        ))}
        {isAdding && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={{
                id: Math.random(),
                title: newTitle,
                completed: false,
                userId: Math.random(),
              }}
              isActive={isAdding}
              onDelete={() => {}}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
