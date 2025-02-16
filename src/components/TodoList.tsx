import React from 'react';
import { TodoItem } from './TodoItem';
import { FilterType } from '../types/types';
import { Todo } from '../types/Todo';

interface TodoListProps {
  todos: Todo[];
  tempTodo?: Todo | null;
  filter: FilterType;
  loading: boolean;
  onDelete: (id: number) => void;
  deletingTodoIds: number[];
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  filter,
  onDelete,
  deletingTodoIds,
}) => {
  const filteredTodos = todos.filter(todo => {
    if (filter === FilterType.Active) {
      return !todo.completed;
    }

    if (filter === FilterType.Completed) {
      return todo.completed;
    }

    return true;
  });

  if (tempTodo && (filter === FilterType.All || filter === FilterType.Active)) {
    filteredTodos.push(tempTodo);
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <div>
        {filteredTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            loading={
              (tempTodo && todo.id === tempTodo.id) ||
              deletingTodoIds.includes(todo.id)
            }
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
};
