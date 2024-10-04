import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { UpdateTodo } from '../types/Updates';

interface Props {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  updateTodo: ({ id, newData }: UpdateTodo) => void;
  todoLoadingStates: { [key: number]: boolean };
}

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  updateTodo,
  todoLoadingStates,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          updateTodo={updateTodo}
          todoLoadingStates={todoLoadingStates}
        />
      ))}
    </section>
  );
};
