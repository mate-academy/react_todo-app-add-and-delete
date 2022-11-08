import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  removeTodo: (todoId: number) => void;
  isTodoAdding: boolean;
  tempTodo: Todo;
  isDeletingCompleted: boolean;
};

export const TodosList: React.FC<Props> = React.memo(({
  todos, removeTodo, isTodoAdding, tempTodo, isDeletingCompleted,
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
              isDeletingCompleted={isDeletingCompleted}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>

      {isTodoAdding && (
        <TodoItem
          todo={tempTodo}
          removeTodo={removeTodo}
          isDeletingCompleted={isDeletingCompleted}
        />
      )}
    </section>
  );
});
