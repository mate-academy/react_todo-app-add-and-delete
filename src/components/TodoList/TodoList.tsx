import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todoList?: Todo[];
  onDeleteTodo: (id: Todo['id']) => Promise<void>;
  tempTodo?: Todo | null;
  isDeletingCompletedTodos?: boolean;
}

export const TodoList: React.FC<Props> = ({
  todoList = [],
  onDeleteTodo,
  tempTodo = null,
  isDeletingCompletedTodos = false,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todoList.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDeleteTodo}
          loading={isDeletingCompletedTodos && todo.completed}
        />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} loading={true} />}
    </section>
  );
};
