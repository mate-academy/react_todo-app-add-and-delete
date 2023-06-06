import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

interface TodoListProps {
  todos: Todo[],
  handleChangeCompleted: (id: number) => void,
  tempTodo: Todo | null,
  deleteTodo: (id: number) => void,
  deleteTodoId: number,
}

export const TodosList: React.FC<TodoListProps> = ({
  todos,
  handleChangeCompleted,
  tempTodo,
  deleteTodo,
  deleteTodoId,
}) => (
  <>
    {todos.map((todo) => {
      return (
        <TodoInfo
          handleChangeCompleted={handleChangeCompleted}
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
        handleChangeCompleted={handleChangeCompleted}
        deleteTodo={deleteTodo}
        deleteTodoId={deleteTodoId}
      />
    )}
  </>
);
