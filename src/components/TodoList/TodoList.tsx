import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  visibleTodos: Todo[];
  todoTemplate: Todo;
  isAdding: boolean;
  handleDeleteTodo: (id: number) => void;
  selectedIDs: number[];
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  handleDeleteTodo,
  isAdding,
  todoTemplate,
  selectedIDs,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    <TransitionGroup>
      {visibleTodos.map(todo => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <TodoItem
            todo={todo}
            key={todo.id}
            handleDeleteTodo={handleDeleteTodo}
            selectedIDs={selectedIDs}
          />
        </CSSTransition>
      ))}

      {isAdding && (
        <CSSTransition
          key={0}
          timeout={300}
          classNames="temp-item"
        >
          <TodoItem
            todo={todoTemplate}
            handleDeleteTodo={handleDeleteTodo}
            selectedIDs={[0]}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
