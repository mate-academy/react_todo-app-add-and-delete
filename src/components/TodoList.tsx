import { useState } from 'react';
import { deleteTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoList = ({
  todos,
  tempTodo,
  setTodos,
  setErrorMessage,
  inputRef,
}: Props) => {
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);

  const handleDeleteTodo = async (todo: Todo) => {
    setDeletingTodoId(todo.id);

    try {
      await deleteTodo(todo.id);

      const filteredTodos = todos.filter(item => item.id !== todo.id);

      setTodos(filteredTodos);

      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch {
      setErrorMessage('Unable to delete a todo');
    }

    setDeletingTodoId(null);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={handleDeleteTodo}
          isLoading={todo.id === deletingTodoId}
        />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} isLoading />}
    </section>
  );
};
