import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoListItem } from '../TodoListItem';

type Props = {
  todos: Todo[]
  removeTodo: (todoId: number) => Promise<void>
  isAdding: boolean
  tempTodo: Todo
  todoIdsToRemove: number[]
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  removeTodo,
  isAdding,
  tempTodo,
  todoIdsToRemove,
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
            <TodoListItem
              todo={todo}
              key={todo.id}
              isLoading={todoIdsToRemove.includes(todo.id)}
              onRemove={removeTodo}
            />
          </CSSTransition>
        ))}

        {isAdding && (
          <CSSTransition
            key={tempTodo.id}
            timeout={300}
            classNames="temp-item"
          >
            <TodoListItem
              todo={tempTodo}
              isLoading={isAdding}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
});
