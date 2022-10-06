import React from 'react';
import { Todo } from '../../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  removeTodo: (id: number) => void;
  removedTodos: number[];
  setRemovedTodos: (removedId: number[]) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  removeTodo,
  removedTodos,
  setRemovedTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">

      {todos.map(({
        id,
        title,
        completed,
      }) => {
        return (
          <TodoItem
            key={id}
            id={id}
            title={title}
            completed={completed}
            removeTodo={removeTodo}
            isAdding={false}
            removedTodos={removedTodos}
            setRemovedTodos={setRemovedTodos}
          />
        );
      })}
      {tempTodo && (
        <TodoItem
          id={tempTodo.id}
          title={tempTodo.title}
          completed={tempTodo.completed}
          removeTodo={removeTodo}
          isAdding
          removedTodos={removedTodos}
          setRemovedTodos={setRemovedTodos}
        />
      )}

    </section>
  );
};
