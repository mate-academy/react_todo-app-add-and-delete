import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type TodoListProps = {
  todos: Todo[];
  filterType: 'All' | 'Active' | 'Completed';
  handleDeleteTodo: (todo: Todo) => void;
  handleToggleComplete: (todo: Todo) => void;
  todoItem: Todo | null;
  currentTodoLoading: number | null;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  filterType,
  todoItem,
  currentTodoLoading,
  handleDeleteTodo,
  handleToggleComplete,
}) => {
  const filterTodoList = (todoList: Todo[]) => {
    switch (filterType) {
      case 'Active':
        return todoList.filter(todo => !todo.completed);
      case 'Completed':
        return todoList.filter(todo => todo.completed);
      default:
        return todoList;
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filterTodoList(todos).map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleToggleComplete={handleToggleComplete}
          handleDeleteTodo={handleDeleteTodo}
          isLoading={currentTodoLoading === todo.id}
        />
      ))}
      {todoItem && (
        <TodoItem
          key={todoItem.id}
          todo={todoItem}
          handleDeleteTodo={handleDeleteTodo}
          handleToggleComplete={handleToggleComplete}
          isLoading
        />
      )}
    </section>
  );
};
