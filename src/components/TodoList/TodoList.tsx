import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useTodoContext } from '../../context/TodosProvider';
import { Todo } from '../../types/Todo';
import { TodoCard } from '../TodoCard/TodoCard';

export const TodoList: React.FC = () => {
  const { filteredTodos, tempTodo } = useTodoContext();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos.map((todo: Todo) => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoCard todo={todo} />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoCard todo={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
