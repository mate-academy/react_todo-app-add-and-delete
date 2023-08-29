import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodoItem } from './TodoItem';
import { useTodo } from '../../api/useTodo';

export const TodoList: React.FC = () => {
  const { filteredTodos } = useTodo();

  return (
    <TransitionGroup>
      {filteredTodos.map(todo => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="temp-item"
        >
          <TodoItem todo={todo} />
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
};
