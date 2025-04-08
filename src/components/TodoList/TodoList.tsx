import React from 'react';
import { TodoComponent } from '../TodoComponent/TodoComponent';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  handleUpdateCompleted: (data: Todo, bool?: boolean) => Promise<Todo>;
  loading: boolean;
  selectedTodo: Todo | null;
  deleteTodo: (todoId: number) => Promise<void>;
  handleUpdateTitle: (data: Todo) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const TodoList: React.FC<Props> = React.memo(
  ({
    todos,
    handleUpdateCompleted,
    handleUpdateTitle,
    loading,
    selectedTodo,
    deleteTodo,
    inputRef,
  }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        {todos.map(todo => (
          <TodoComponent
            key={todo.id}
            todo={todo}
            handleUpdateCompleted={handleUpdateCompleted}
            handleUpdateTitle={handleUpdateTitle}
            loading={loading}
            selectedTodo={selectedTodo}
            deleteTodo={deleteTodo}
            inputRef={inputRef}
          />
        ))}
      </section>
    );
  },
);

TodoList.displayName = 'TodoList';
