import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import './TodoListAnimations.scss';

import { TodoItem } from '../TodoItem';
import { TodoLoadingItem } from '../TodoLoadingItem';

import { UseTodosContext } from '../../utils/TodosContext';

type Props = {
};

export const TodoList: React.FC<Props> = () => {
  const context = UseTodosContext();

  const {
    filteredTodos,
    tempTodo,
  } = context;

  return (
    <section data-cy="TodoList" className="todoapp__main">
      <TransitionGroup>
        {filteredTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              key={todo.id}
              todo={todo}
            />

          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoLoadingItem key={tempTodo.id} tempTodo={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
