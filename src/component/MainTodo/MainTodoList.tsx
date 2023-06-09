import React from 'react';
import { Todo } from '../../types/Todo';
import { MainTodoDetails } from './MainTodoDetails';

interface Props {
  todos: Todo[];
  deleteToDo: (userId: number) => void;
  tempTodo: Todo | null;
}

export const MainTodoList: React.FC<Props> = (
  { todos, deleteToDo, tempTodo },
) => {
  return (
    <section className="todoapp__main">
      {tempTodo !== null ? (
        <MainTodoDetails
          todo={tempTodo}
          key={tempTodo.id}
          deleteToDo={deleteToDo}
        />
      ) : (
        todos.map((todo) => (
          <MainTodoDetails
            todo={todo}
            key={todo.id}
            deleteToDo={deleteToDo}
          />
        ))
      )}
    </section>
  );
};
