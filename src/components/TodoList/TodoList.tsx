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
  changeStatus:(todoId: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  changeStatus,
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
              changeStatus={changeStatus}

            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
};
