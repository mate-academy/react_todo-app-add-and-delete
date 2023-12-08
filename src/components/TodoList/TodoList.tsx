import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo?: Todo | null;
  onDeleteTodo?: (todoId: number) => void;
  processingTodoIds: number[],
  onUpdateTodo: (updatedTodo: Todo) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo = null,
  onDeleteTodo,
  processingTodoIds,
  onUpdateTodo,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onDeleteTodo={onDeleteTodo}
        processingTodoIds={processingTodoIds}
        onUpdateTodo={onUpdateTodo}
      />
    ))}

    {tempTodo && (
      <TodoItem
        key={tempTodo.id}
        todo={tempTodo}
        processingTodoIds={processingTodoIds}
      />
    )}
  </section>
);
