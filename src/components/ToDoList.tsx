import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  filteredTodos: Todo[];
  deleteTodoById: number[];
  handleToggleTodo: (todoId: number) => void;
  handleDeleteTodo: (id: number) => void;
  tempTodo: Todo | null;
}

export const ToDoList: React.FC<Props> = ({
  filteredTodos,
  deleteTodoById,
  handleToggleTodo,
  handleDeleteTodo,
  tempTodo,
}) => {
  return (
    <>
      <section className="todoapp__main" data-cy="TodoList">
        {filteredTodos.map(todo => {
          const isProcessing = deleteTodoById.includes(todo.id);

          return (
            <TodoItem
              key={todo.id}
              todo={todo}
              handleToggleTodo={handleToggleTodo}
              handleDeleteTodo={handleDeleteTodo}
              isProcessing={isProcessing}
            />
          );
        })}
      </section>

      {tempTodo && (
        <TodoItem
          key={0}
          todo={tempTodo}
          handleToggleTodo={() => {}}
          handleDeleteTodo={() => {}}
          isProcessing={true}
        />
      )}
    </>
  );
};
