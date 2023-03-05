import React from 'react';
import { Todo } from '../types/Todo';
import { TodoInfo } from './todoInfo';
import { TempTodo } from './tempTodo';

type Props = {
  todos: Todo[],
  addComplitedTodo: (id: number) => void,
  onTodoDelete: (id: number) => void,
  todoToDeleteId: number[],
  tempTodo: Todo | null,
};

export const Main: React.FC<Props> = ({
  todos,
  addComplitedTodo,
  onTodoDelete,
  todoToDeleteId,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => {
        return (
          <TodoInfo
            todoInfo={todo}
            key={todo.id}
            addComplitedTodo={addComplitedTodo}
            onTodoDelete={onTodoDelete}
            todoToDeleteId={todoToDeleteId}
          />
        );
      })}
      {tempTodo !== null && (
        <TempTodo title={tempTodo.title} />
      )}
    </section>
  );
};
