import React from 'react';
import { Todo } from '../types/Types';
import { TodoItem } from './TodoItem';

type TodoListProps = {
  todos: Todo[];
  tempTodo: Todo | null | undefined;
  deleteCurrentTodo: (id: number) => void;
  deleteTodoByID: number | null | undefined;
};

export const TodoList = ({
  todos,
  tempTodo,
  deleteCurrentTodo,
  deleteTodoByID,
}: TodoListProps) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            title={todo.title}
            id={todo.id}
            completed={todo.completed}
            deleteCurrentTodo={deleteCurrentTodo}
            deleteTodoByID={deleteTodoByID}
          />
        );
      })}

      {tempTodo && (
        <TodoItem
          title={tempTodo.title}
          id={tempTodo.id}
          completed={tempTodo.completed}
          deleteCurrentTodo={deleteCurrentTodo}
          deleteTodoByID={deleteTodoByID}
        />
      )}
    </section>
  );
};
