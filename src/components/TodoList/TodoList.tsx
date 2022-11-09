import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import '../../styles/transitiongroup.scss';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  filteredTodo: Todo[];
  removeTodo: (TodoId: number) => void;
  selectedId: number[];
  isAdding: boolean;
  title: string;
};

export const TodoList: React.FC<Props> = ({
  filteredTodo,
  removeTodo,
  selectedId,
  isAdding,
  title,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodo.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              key={todo.id}
              removeTodo={removeTodo}
              selectedId={selectedId}
              isAdding={isAdding}
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
                id: 0,
                title,
                completed: false,
                userId: 0,
              }}
              removeTodo={removeTodo}
              selectedId={selectedId}
              isAdding={isAdding}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
