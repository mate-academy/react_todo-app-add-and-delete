import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  deleteTodo: (id: number) => void,
  isDeleting: boolean,
  deletedId: number,
};

export const TodoList: React.FC<Props> = React.memo(
  ({ todos, tempTodo, deleteTodo, isDeleting, deletedId }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <TodoItem
                todo={todo}
                deleteTodo={deleteTodo}
                isDeleting={isDeleting}
                deletedId={deletedId}
              />
            </li>
          ))}

          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              deleteTodo={deleteTodo}
              isDeleting={isDeleting}
              deletedId={deletedId}
            />
          )}
        </ul>
      </section>
    );
  },
);
