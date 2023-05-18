import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onClose(todoId: number[]): void;
  deletedTodos: number[];
};

export const TodoList: React.FC<Props> = React.memo(
  ({ todos, onClose, deletedTodos }) => {
    return (
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <TodoItem
              todo={todo}
              onClose={onClose}
              deletedTodos={deletedTodos}
            />
          </li>
        ))}
      </ul>
    );
  },
);
