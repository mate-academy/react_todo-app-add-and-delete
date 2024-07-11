import React from 'react';
import { Todo } from './types/Todo';
import { Status } from './types/status';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todosByStatus: (query?: Status) => Todo[];
  handleCheck: (id: number) => void;
  queryStatus: Status;
  deleteTodo: (id: number) => void;
  deletedIds: number[];
  tempTodo: Todo | null;
}

export const TodoList: React.FC<TodoListProps> = ({
  queryStatus,
  todosByStatus,
  handleCheck,
  deleteTodo,
  deletedIds,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosByStatus(queryStatus)?.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleCheck={handleCheck}
          deleteTodo={deleteTodo}
          deletedIds={deletedIds}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          handleCheck={() => {}}
          deleteTodo={() => {}}
          deletedIds={[]}
        />
      )}
    </section>
  );
};
