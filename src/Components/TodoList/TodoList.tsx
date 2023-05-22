import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { Category } from '../../types/Category';

interface Props {
  todos: Todo[],
  onDelete: (id: number) => void;
  tempTodo: Todo | null;
  category: Category;

}
export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  tempTodo,
  category,
}) => {
  const filteredTodos = todos.filter(todo => {
    switch (category) {
      case Category.Active:
        return !todo.completed;
      case Category.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  return (
    <section className="todoapp__main">
      {filteredTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDelete={onDelete}
        />
      )}
    </section>
  );
};
