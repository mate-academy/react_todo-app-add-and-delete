import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../Todo/TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  todosInProcess: number[];
  deleteTodo: (todo: Todo) => void;
}

export const TodoList: React.FC<Props> = React.memo(({
  tempTodo,
  todos,
  todosInProcess,
  deleteTodo,
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
              isProcessed={todosInProcess.includes(todo.id)}
              onDelete={() => {
                deleteTodo(todo);
              }}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={tempTodo}
              isProcessed
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
});
