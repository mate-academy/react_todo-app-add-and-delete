import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from './TodoItem';

// import { todosService } from '../../services/todosService';
// import { USER_ID } from '../../api/todos';

interface TodoListProps {
  todos: Todo[];
  processingIds: number[];
  getFilteredTodos: () => Todo[];
  handleToggleTodo: (todo: Todo) => void;
  handleRemoveTodo: (id: number) => void;
  tempTodo?: Todo | null;
  isCreatingTodo?: boolean;
  isLoading: boolean;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  processingIds,
  getFilteredTodos,
  handleToggleTodo,
  handleRemoveTodo,
  tempTodo,
  // isCreatingTodo,
  isLoading,
}) => {
  return (
    <div className="todoapp__content">
      {isLoading && todos.length === 0 ? (
        <p>Loading...</p>
      ) : (
        (todos.length > 0 || tempTodo) && (
          <section className="todoapp__main" data-cy="TodoList">
            {getFilteredTodos().map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                processingIds={processingIds}
                handleToggleTodo={handleToggleTodo}
                handleRemoveTodo={handleRemoveTodo}
              />
            ))}

            {tempTodo && (
              <TodoItem
                key={0}
                todo={tempTodo}
                processingIds={[...processingIds, 0]}
                handleToggleTodo={() => {}}
                handleRemoveTodo={() => {}}
              />
            )}
          </section>
        )
      )}
    </div>
  );
};
