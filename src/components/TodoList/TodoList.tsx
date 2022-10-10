import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  removeTodo: (id: number) => void;
  loader: boolean;
  newTodoId: number;
};

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  loader,
  newTodoId,
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
              loader={loader}
              newTodoId={newTodoId}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
};
