import React from 'react';
import '../../styles/animation.scss';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  clearIsPressed: boolean;
  removeTodo: (id: number) => void;
};

export const TodosList: React.FC<Props> = ({
  todos,
  clearIsPressed,
  removeTodo,
}) => {
  return (
    <TransitionGroup>
      {todos.map(todo => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <TodoItem
            todo={todo}
            key={todo.id}
            isTempTodo={false}
            clearIsPressed={clearIsPressed}
            removeTodo={removeTodo}
          />
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
};
