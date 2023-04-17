import { TodoInterface } from "../../types/todo";
import { Todo } from "../Todo/Todo";

type Props = {
  todos: TodoInterface[];
  onDeleteTodo: (id: number) => void;
  temporaryTodo: TodoInterface | undefined;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  temporaryTodo,
}) => (
  <>
    {todos.map((todo) => (
      <Todo todo={todo} key={todo.id} onDelete={onDeleteTodo} />
    ))}
    {temporaryTodo && (
      <Todo
        todo={temporaryTodo}
        key={temporaryTodo.id}
        onDelete={onDeleteTodo}
      />
    )}
  </>
);
