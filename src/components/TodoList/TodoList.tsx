import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

interface TodoListProps {
  todos: Todo[],
  tempTodo: Todo | null,
  deleteTodo: (id: number) => void,
  deleteTodoId: number,
}

export const TodosList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  deleteTodo,
  deleteTodoId,
}) => (
  <>
    {todos.map((todo) => {
      return (
        <TodoInfo
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
          deleteTodoId={deleteTodoId}
        />
      );
    })}

    {tempTodo && (
      <TodoInfo
        todo={tempTodo}
        deleteTodo={deleteTodo}
        deleteTodoId={deleteTodoId}
      />
    )}
  </>
);
