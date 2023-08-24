import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { TodosItems } from './TodosItems';
import { useTodo } from '../Hooks/UseTodo';
import { Todo } from '../types/Todo';

type Props = {
  tempTodo: Todo | null;
};

export const Todoslist: React.FC<Props> = ({ tempTodo }) => {
  const { filterTodos } = useTodo();

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {filterTodos().map(todos => (
          <CSSTransition
            key={todos.id}
            timeout={300}
            classNames="item"
          >
            <TodosItems items={todos} />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodosItems items={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
