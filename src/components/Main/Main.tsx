/* eslint-disable jsx-a11y/label-has-associated-control */
import * as React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';
import { TodosContext, TempTodoContext } from '../../utils/Store';

interface MainProps {
  filteredTodos: Todo[];
}

export const Main: React.FC<MainProps> = ({ filteredTodos }) => {
  const { tempTodo } = React.useContext(TempTodoContext);
  const { todos } = React.useContext(TodosContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.length > 0 &&
          filteredTodos.map((todo: Todo) => (
            <CSSTransition key={todo?.id} timeout={300} classNames="item">
              <TodoItem todo={todo} />
            </CSSTransition>
          ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} isTemp={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
