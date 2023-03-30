import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import React from 'react';
import { TodoInfo } from '../TodoInfo/TodoInfo';
import { Todo } from '../../types/Todo';
import '../../styles/animation.scss';

type Props = {
  todos: Todo[],
  tempoTodo: Todo | null,
  loadingTodo: number[];
  removeTodo: (id: number) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempoTodo,
  loadingTodo,
  removeTodo,
}) => {
  return (
    <ul className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map((todo) => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoInfo
              todo={todo}
              removeTodo={removeTodo}
              loadingTodo={loadingTodo}
            />
          </CSSTransition>
        ))}

        {tempoTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoInfo
              todo={tempoTodo}
              removeTodo={removeTodo}
              loadingTodo={loadingTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </ul>
  );
};
