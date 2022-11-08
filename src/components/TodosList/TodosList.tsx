import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  removeTodo: (todoId: number) => void;
  isTodoAdding: boolean;
  tempTodo: Todo;
};

export const TodosList: React.FC<Props> = React.memo(({
  todos, removeTodo, isTodoAdding, tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={500}
            classNames="todoTransition"
          >
            <TodoItem
              todo={todo}
              removeTodo={removeTodo}
              isTodoAdding={isTodoAdding}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>

      {isTodoAdding && (
        <TodoItem
          todo={tempTodo}
          removeTodo={removeTodo}
          isTodoAdding={isTodoAdding}
        />
      )}
    </section>
  );
});
