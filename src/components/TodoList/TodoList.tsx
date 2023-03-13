import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import '../../styles/items.scss';
import { TodoInfo } from '../TodoInfo';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  removeTodo: (id: number) => void;
  idUpdating: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  removeTodo,
  idUpdating,
}) => {
  return (

    <section className="todoapp__main">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoInfo
              key={todo.id}
              todo={todo}
              removeTodo={removeTodo}
              idUpdating={idUpdating}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoInfo
              todo={tempTodo}
              removeTodo={removeTodo}
              idUpdating={idUpdating}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
