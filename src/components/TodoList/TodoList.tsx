import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  deleteTodo: (id: number) => void,
};

export const TodoList: React.FC<Props> = React.memo(
  ({
    todos, tempTodo, deleteTodo,
  }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <TodoItem
                todo={todo}
                deleteTodo={deleteTodo}
              />
            </li>
          ))}

          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              deleteTodo={deleteTodo}
            />
          )}
        </ul>
      </section>
    );
  },
);
