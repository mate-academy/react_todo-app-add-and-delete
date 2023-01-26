import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  onTodoDelete: (selectedTodoId: number) => void,
  tempTodo: Todo | null,
};

export const TodoList: React.FC<Props> = ({
  todos,
  onTodoDelete,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onTodoDelete={onTodoDelete}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
        />
      )}
    </section>
  );
};
