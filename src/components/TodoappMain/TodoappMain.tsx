import { deleteTodo, patchTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { errorNotification } from '../../utils/errorFunction';
import { TodoElement } from '../TodoElement/TodoElement';

interface TodoappMainProps {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorNotification: (msg: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const TodoappMain: React.FC<TodoappMainProps> = ({
  todos,
  setTodos,
  setErrorNotification,
  inputRef,
}) => {
  const handleTodoDelete = async (idTodo: number) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === idTodo ? { ...todo, isLoaded: false } : todo,
      ),
    );

    try {
      await deleteTodo(idTodo);
      setTodos(prev => prev.filter(todo => todo.id !== idTodo));
      inputRef.current?.focus();
    } catch {
      errorNotification('Unable to delete a todo', setErrorNotification);

      setTodos(prev =>
        prev.map(todo =>
          todo.id === idTodo ? { ...todo, isLoaded: true } : todo,
        ),
      );
    }
  };

  const handleToggleStatus = async (idTodo: number) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === idTodo ? { ...todo, isLoaded: false } : todo,
      ),
    );

    const todoToUpdate = todos.find(todo => todo.id === idTodo);

    if (!todoToUpdate) {
      return;
    }

    try {
      const updated = await patchTodo(idTodo, {
        completed: !todoToUpdate.completed,
      });

      setTodos(prev =>
        prev.map(todo =>
          todo.id === idTodo ? { ...updated, isLoaded: true } : todo,
        ),
      );
    } catch {
      errorNotification('Unable to update todo status', setErrorNotification);
    }
  };

  const handleUpdateTodo = async (updatedTodo: Todo) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === updatedTodo.id ? { ...todo, isLoaded: false } : todo,
      ),
    );

    try {
      const serverTodo = await patchTodo(updatedTodo.id, {
        title: updatedTodo.title,
      });

      setTodos(prev =>
        prev.map(todo =>
          todo.id === serverTodo.id
            ? { ...todo, title: updatedTodo.title, isLoaded: true }
            : todo,
        ),
      );
    } catch {
      errorNotification('Unable to update todo', setErrorNotification);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoElement
          key={todo.id}
          todo={todo}
          handleTodoDelete={handleTodoDelete}
          handleToggleStatus={handleToggleStatus}
          handleUpdateTodo={handleUpdateTodo}
        />
      ))}
    </section>
  );
};
