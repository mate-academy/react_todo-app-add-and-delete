import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  filteredTodos: Todo[];
  isAdding: boolean;
  tempTodo: Todo;
  todoIdsToRemove: number[];
  removeTodoFromServer: (todoId: number) => void;
}

export const TodoList: React.FC<Props> = React.memo(({
  filteredTodos,
  isAdding,
  tempTodo,
  todoIdsToRemove,
  removeTodoFromServer,
}) => (
  <main className="todoapp__main" data-cy="TodoList">
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
            isLoading={todoIdsToRemove.includes(todo.id)}
            removeTodoFromServer={removeTodoFromServer}
          />
        </CSSTransition>
      ))}

      {isAdding && (
        <CSSTransition
          key={tempTodo.id}
          timeout={300}
          classNames="temp-item"
        >
          <TodoItem
            todo={tempTodo}
            isLoading={isAdding}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </main>
));
