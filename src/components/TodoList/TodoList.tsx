import React, { useState } from 'react';
import { TodoPlate } from '../TodoPlate/TodoPlate';
import { Todo } from '../../types/Todo';
import * as todoServices from '../../api/todos';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  todoList: Todo[];
  tempTodo: Todo | null;
  setTodoList: (todoList: Todo[]) => void;
  sendError: (error: ErrorType) => void;
};

export const TodoList: React.FC<Props> = ({
  todoList,
  setTodoList,
  tempTodo,
  sendError,
}) => {
  const [isDeleting, setDeleting] = useState(0);

  const deleteTodo = async (todoId: number) => {
    setDeleting(todoId);

    try {
      await todoServices.deleteTodo(todoId);

      setTodoList(todoList.filter(todo => todo.id !== todoId));
    } catch {
      sendError(ErrorType.DELETE_TODO);
    }

    setDeleting(0);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todoList.map(todo => (
        <TodoPlate
          todo={todo}
          key={todo.id}
          isDeleting={isDeleting}
          onDelete={deleteTodo}
        />
      ))}
      {tempTodo && (
        <TodoPlate todo={tempTodo} key={tempTodo.id} onDelete={deleteTodo} />
      )}
    </section>
  );
};
