import React from 'react';
import { Todo } from '../types/Todo';
import { OneTodo } from './OneTodo';

interface Props {
  todos: Todo[],
  tempTodo?: Todo | null,
  onDeleteTodo?: (todoId: number) => void,
  processingTodoIds: number[],
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDeleteTodo,
  processingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <OneTodo
            todo={todo}
            onDeleteTodo={onDeleteTodo}
            proccesingTodoIds={processingTodoIds}
          />
        );
      })}
      {tempTodo && (
        <OneTodo
          key={tempTodo.id}
          todo={tempTodo}
          proccesingTodoIds={processingTodoIds}
        />
      )}
    </section>
  );
};
