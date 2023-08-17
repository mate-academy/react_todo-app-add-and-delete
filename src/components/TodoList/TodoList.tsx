import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoItem } from '../TodoItem/TodoItem';
import { useTodo } from '../../hooks/useTodo';
import { Todo } from '../../types/Todo';
import './animations.scss';

type Props = {
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({ tempTodo }) => {
  const { visibleTodos } = useTodo();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem todo={todo} />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={tempTodo.id}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={tempTodo}
              loading
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
