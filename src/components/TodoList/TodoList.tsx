/* eslint-disable react/display-name */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import './styles/todoapp.scss';
import { TodoWithLoader } from '../../types/TodoWithLoader';
import { TodoItem } from './components/TodoItem/TodoItem';
import { TempTodo } from './components/TempTodo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';

type Props = {
  todos: TodoWithLoader[];
  tempTodo: Todo | null;
  updatedAt: Date;
};

export const TodoList: React.FC<Props> = React.memo(({ todos, tempTodo }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.length > 0 &&
          todos.map(todo => {
            return (
              <CSSTransition timeout={300} classNames="item" key={todo.id}>
                <TodoItem todo={todo} />
              </CSSTransition>
            );
          })}
        {tempTodo && (
          <CSSTransition timeout={300} classNames="temp-item" key={'tempTodo'}>
            <TempTodo tempTodo={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
});
