import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  onChangeTodoStatus: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdateTodo: (todo: Todo) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onChangeTodoStatus,
  onDelete,
  onUpdateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoItem
            todo={todo}
            key={todo.id}
            onChangeTodoStatus={onChangeTodoStatus}
            onDelete={onDelete}
            onUpdateTodo={onUpdateTodo}
          />
        );
      })}
      {tempTodo && <TodoItem todo={tempTodo} />}
    </section>
  );
};
