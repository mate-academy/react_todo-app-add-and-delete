import React from 'react';

import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import { TodoType } from '../../types/TodoType';

import Todo from '../Todo/Todo';

type Props = {
  visibleTodos: TodoType[];
  tempTodo: TodoType | null;
  removeTodo: (id: number) => Promise<void>;
  isActiveDelComTodo?: boolean;
};

const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  removeTodo,
  isActiveDelComTodo,
}) => (
  <ul>
    <TransitionGroup>
      {visibleTodos.map(todo => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <Todo
            todo={todo}
            removeTodo={removeTodo}
            isNewTodo={false}
            isActiveDelComTodo={isActiveDelComTodo}
          />
        </CSSTransition>
      ))}

      {tempTodo && (
        <CSSTransition
          key={0}
          timeout={300}
          classNames="temp-item"
        >
          <Todo
            todo={tempTodo}
            removeTodo={removeTodo}
            isNewTodo
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </ul>
);

export default TodoList;
