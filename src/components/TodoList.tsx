import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  filteredTodos: Todo[];
  tempTodo: Todo | null;
  isDeleteing: boolean;
  handleDelete: (id: number) => void;
  todoForDelete: number;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  tempTodo,
  isDeleteing,
  // isClearCompleted,
  handleDelete,
  todoForDelete,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {filteredTodos.map(todo => (
      <TodoItem
        todo={todo}
        key={todo.id}
        isDeleteing={isDeleteing}
        // isClearCompleted={isClearCompleted}
        handleDelete={handleDelete}
        todoIdForDelete={todoForDelete}
      />
    ))}
    {tempTodo !== null && (
      <TodoItem todo={tempTodo} isTempTodo={true} handleDelete={handleDelete} />
    )}
  </section>
);
