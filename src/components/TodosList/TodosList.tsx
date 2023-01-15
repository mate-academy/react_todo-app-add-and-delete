import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[],
  newTodo?: Todo,
  isAdding?: boolean,
  handleDelete: (event: React.MouseEvent<HTMLButtonElement>) => void,
  deletedId: number[] | null,
}

export const TodosList: React.FC<Props> = ({
  todos,
  newTodo,
  isAdding,
  handleDelete,
  deletedId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <div>
        {todos.map(todo => (
          <TodoItem
            todo={todo}
            key={todo.id}
            handleDelete={handleDelete}
            deletedId={deletedId}
          />
        ))}
        {newTodo
          && (
            <TodoItem
              todo={newTodo}
              isAdding={isAdding}
            />
          )}
      </div>
    </section>
  );
};
