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
      <ul className="todo-list">
        <TransitionGroup component={null}>
          {visibleTodos.map(todo => (
            <CSSTransition
              key={todo.id}
              timeout={300}
              classNames="item"
            >
              <li>
                <TodoItem todo={todo} />
              </li>
            </CSSTransition>
          ))}

          {tempTodo && (
            <CSSTransition
              key={tempTodo.id}
              timeout={300}
              classNames="temp-item"
            >
              <li>
                <TodoItem todo={tempTodo} loading />
              </li>
            </CSSTransition>
          )}
        </TransitionGroup>
      </ul>
    </section>
  );
};
