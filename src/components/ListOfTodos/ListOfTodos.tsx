import { Todo } from '../../types/Todo';
import { TodoElement } from '../TodoElement/TodoElement';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  onTodoDeletion: (id:number) => void,
  deletingTodoId: number[];
};

export const ListOfTodos: React.FC<Props> = ({
  todos,
  tempTodo,
  onTodoDeletion,
  deletingTodoId,
}) => (
  <>
    {todos.map((todo) => {
      const isLoading = deletingTodoId.some(id => id === todo.id);

      return (
        <TodoElement
          todo={todo}
          key={todo.id}
          onTodoDeletion={onTodoDeletion}
          isLoading={isLoading}
        />
      );
    })}
    {tempTodo && (
      <TodoElement
        todo={tempTodo}
        onTodoDeletion={onTodoDeletion}
        isLoading
      />
    )}
  </>
);
