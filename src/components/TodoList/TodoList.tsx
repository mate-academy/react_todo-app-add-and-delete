import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';
import { Errors } from '../../types/Errors';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onChangeIsError: (e: Errors) => void
  onDelete: (id: number) => void
  changeTodo: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onChangeIsError,
  tempTodo,
  onDelete,
  changeTodo,
}) => {
  const updateTodo = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number,
  ) => {
    const { checked } = event.target;

    changeTodo((prevState: Todo[]) => {
      return prevState.map(todo => {
        if (todo.id === id) {
          return {
            ...todo,
            completed: checked,
          };
        }

        return todo;
      });
    });
  };

  return (
    <div>
      {todos.map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onChangeIsError={onChangeIsError}
          onDeleteTodo={() => onDelete(todo.id)}
          onCompleteTodo={updateTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          onChangeIsError={onChangeIsError}
          onDeleteTodo={() => onDelete(tempTodo.id)}
          onCompleteTodo={updateTodo}
        />
      )}
    </div>
  );
};
