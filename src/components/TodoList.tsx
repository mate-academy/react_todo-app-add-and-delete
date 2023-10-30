import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  handleTodoStatusUpdate: (status: boolean, id: Todo['id']) => void;
  onDelete: (todoId: Todo['id']) => void,
};

export const TodoList: React.FC<Props>
  = ({ todos, handleTodoStatusUpdate, onDelete }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        {todos.map((todo) => (
          <TodoItem
            todo={todo}
            handleTodoStatusUpdate={handleTodoStatusUpdate}
            onDelete={onDelete}
          />
        ))}
      </section>
    );
  };
