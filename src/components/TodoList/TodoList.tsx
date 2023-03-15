import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  tempTodo?: Todo;
  deleteTodo: (id:number) => void;
  loadingTodoId: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deleteTodo,
  loadingTodoId,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => {
        const isLoading = loadingTodoId.some(id => id === todo.id);

        return (
          <TodoInfo
            todo={todo}
            key={todo.id}
            isLoading={isLoading}
            deleteTodo={deleteTodo}
          />
        );
      })}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          isLoading
          deleteTodo={() => {}}
        />
      )}
    </section>
  );
};
