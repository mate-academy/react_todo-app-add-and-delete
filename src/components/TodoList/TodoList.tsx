import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  idToDelete: number[];
};

export const TodoList: React.FC<Props> = ({ todos, onDelete, idToDelete }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoItem
            todo={todo}
            key={todo.id}
            onDelete={onDelete}
            idToDelete={idToDelete}
          />
        );
      })}
    </section>
  );
};
