import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import '../../styles/transitiongroup.scss';

type Props = {
  todos: Todo[];
  removeTodo:(todoId: number) => void;
  changeProperty:(todoId: number, property: Partial<Todo>) => void;
  selectedTodoId: number;
  isToggling: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  changeProperty,
  selectedTodoId,
  isToggling,

}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              removeTodo={removeTodo}
              changeProperty={changeProperty}
              selectedTodoId={selectedTodoId}
              isToggling={isToggling}
              key={Math.random()}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
};
