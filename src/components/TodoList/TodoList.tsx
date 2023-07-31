import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: null | Todo;
  deleteIds: number[];
  deleteTodo: (todoId: number) => Promise<void>;
};

export const TodoList: React.FC<Props> = (
  {
    todos,
    tempTodo,
    deleteIds,
    deleteTodo,
  },
) => {
  return (
    <section className="todoapp__main">
      {
        todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            deleteIds={deleteIds}
            deleteTodo={deleteTodo}
          />
        ))
      }
      {
        tempTodo
        && (
          <TodoItem
            tempTodo={tempTodo}
            deleteTodo={deleteTodo}
          />
        )
      }
    </section>
  );
};
