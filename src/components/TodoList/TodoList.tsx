import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import '../../styles/transitiongroup.scss';

type Props = {
  todos: Todo[];
  removeTodo:(todoId: number) => void;
  changeProperty:(todoId: number, property: Partial<Todo>) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  changeProperty,
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
              removeTodo={removeTodo}
              changeProperty={changeProperty}

            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
};
