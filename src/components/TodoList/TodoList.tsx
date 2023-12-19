import React from 'react';
import { Todo } from '../../types/Todo';
import { SingleTodo } from '../SingleTodo/SingleTodo';

type Props = {
  todos: Todo[],
  tempTodo?: Todo | null,
  onDeleteTodo?: (todoId: number) => void,
  processingTodoIds: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo = null,
  onDeleteTodo,
  processingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <SingleTodo
            todo={todo}
            onDeleteTodo={onDeleteTodo}
            processingTodoIds={processingTodoIds}
          />
        );
      })}
      {tempTodo && (
        <SingleTodo
          key={tempTodo.id}
          todo={tempTodo}
          processingTodoIds={processingTodoIds}
        />
      )}
    </section>
  );
};
