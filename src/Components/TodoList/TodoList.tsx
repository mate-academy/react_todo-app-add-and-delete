import { todo } from "../../types/todo";
import { Todo } from "../Todo/Todo";

type Props = {
  todos: todo[];
  onDeleteTodo: (id: number) => void;
  temporaryTodo: todo | undefined;
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
