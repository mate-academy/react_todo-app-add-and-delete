import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  handleChangeCompleted: (id: number) => void,
  tempTodo: Todo | null,
  deleteTodo: (id: number) => void,
  deleteTodoId: number,
};

export const TodosList: React.FC<Props> = ({
  todos,
  handleChangeCompleted,
  tempTodo,
  deleteTodo,
  deleteTodoId,
}) => (
  <>
    {todos.map((todo) => {
      return (
        <TodoItem
          handleChangeCompleted={handleChangeCompleted}
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
          deleteTodoId={deleteTodoId}
        />
      );
    })}

    {tempTodo && (
      <TodoItem
        todo={tempTodo}
        handleChangeCompleted={handleChangeCompleted}
        deleteTodo={deleteTodo}
        deleteTodoId={deleteTodoId}
      />
    )}
  </>
);
