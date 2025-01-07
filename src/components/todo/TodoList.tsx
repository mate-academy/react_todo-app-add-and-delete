import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodos } from '../../api/todos';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todoList: Todo[];
  setError: (error: string) => void;
  setTodoList: (todos: Todo[]) => void;
  tempTodo: Todo | null;
}

export const TodoList: React.FC<Props> = ({
  todoList,
  setError,
  setTodoList,
  tempTodo,
}) => {
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleDeleteTodo = async (id: number) => {
    setLoadingId(id);
    try {
      await deleteTodos(id);

      setTodoList(todoList.filter(todo => todo.id !== id));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todoList.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loading={todo.id === loadingId}
          handleDeleteTodo={handleDeleteTodo}
        />
      ))}
      {tempTodo && (
        <TodoItem todo={tempTodo} loading={true} handleDeleteTodo={() => {}} />
      )}
    </section>
  );
};
