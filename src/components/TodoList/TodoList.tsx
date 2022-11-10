import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoData } from '../TodoData';

type Props = {
  todos: Todo[];
  handleDeleteTodo: (todoId: number) => void;
  isAdding: boolean;
  tempTodo: Todo;
  deletingTodosId: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  handleDeleteTodo,
  isAdding,
  tempTodo,
  deletingTodosId,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => {
      return (
        <TodoData
          todo={todo}
          key={todo.id}
          handleDeleteTodo={() => handleDeleteTodo(todo.id)}
          deletingTodosId={deletingTodosId}
        />
      );
    })}
    {isAdding && (
      <TodoData
        todo={tempTodo}
        key={tempTodo.id}
        handleDeleteTodo={() => handleDeleteTodo(tempTodo.id)}
        deletingTodosId={deletingTodosId}
      />
    )}
  </section>
);
