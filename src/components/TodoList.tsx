import React from "react";
import { Todo } from "../types/Todo";
import { TodoItem } from "./TodoItem";

type TodoListProps = {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  isLoading: boolean;
  handleDeleteTodo: (todoId: number) => void;
  isCurrentLoading: boolean;
};

export const TodoList: React.FC<TodoListProps> = ({
  visibleTodos,
  tempTodo,
  isLoading,
  handleDeleteTodo,
  isCurrentLoading,

}) => {

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          handleDeleteTodo={handleDeleteTodo}
          isLoading={isLoading}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          handleDeleteTodo={handleDeleteTodo}
          isLoading={isCurrentLoading}
        />
      )}
    </section>
  );
};
