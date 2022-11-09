import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  handleDeleteButton: (todoId: number) => void;
  temporaryTodo: Todo;
  isAdding?: boolean;
  isDeleting: boolean;
  selectedTodoId: number[];
};

export const TodoList: React.FC<Props>
  = React.memo(({
    todos, handleDeleteButton, temporaryTodo, isAdding, isDeleting,
    selectedTodoId,
  }) => (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          todo={todo}
          handleDeleteButton={handleDeleteButton}
          key={todo.id}
          isDeleting={isDeleting}
          isActive={selectedTodoId.includes(todo.id)}
        />
      ))}
      {isAdding && (
        <TodoInfo
          isAdding={isAdding}
          todo={temporaryTodo}
        />
      )}
    </section>
  ));
