import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';
import { deleteTodo } from '../../api/todos';

type Props = {
  setTodoList: (todos: Todo[]) => void;
  todos: Todo[];
  setErrorMessage: (errorMessage: string) => void;
  deletedTodos: number[];
  setDeletedTodos: (deletedTodos: number[]) => void;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodoList,
  setErrorMessage,
  deletedTodos,
  setDeletedTodos,
  tempTodo,
}) => {
  const handleDeleteTodo = async (todoID: number) => {
    try {
      setDeletedTodos([todoID]);
      const newTodos = todos.filter((todo) => todo.id !== todoID);

      await deleteTodo(`/todos/${todoID}`);

      setTodoList(newTodos);
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setDeletedTodos([]);
    }
  };

  const isIncludesTempTodo = deletedTodos.includes(0);

  return (
    <section className="todoapp__main">
      {todos.map((todo) => {
        const isIncludes = deletedTodos.includes(todo.id);

        return (
          <TodoInfo
            isIncludes={isIncludes}
            todo={todo}
            onDelete={handleDeleteTodo}
            key={todo.id}
          />
        );
      })}
      {tempTodo && (
        <TodoInfo
          isIncludes={isIncludesTempTodo}
          todo={tempTodo}
          onDelete={handleDeleteTodo}
        />
      )}
    </section>
  );
};
