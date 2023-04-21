import React from 'react';
import '../../styles/animation.scss';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  isClearPressed: boolean;
  removeTodo: (id: number) => void;
};

export const TodosList: React.FC<Props> = ({
  todos,
  isClearPressed,
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
            isClearPressed={isClearPressed}
            removeTodo={removeTodo}
          />
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
};
