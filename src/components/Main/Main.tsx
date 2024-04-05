import React from 'react';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  todosIdToDelete: number[];
};

export const Main: React.FC<Props> = ({ todos, onDelete, todosIdToDelete }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const isTodoOnDelete = todosIdToDelete.includes(todo.id);

        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            isShowLoader={isTodoOnDelete}
            onDelete={onDelete}
          />
        );
      })}
    </section>
  );
};
