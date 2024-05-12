import { useContext } from "react";
import { TodoItem } from "./todo";
import { TodosContext } from "../services/Store";

export const Todos: React.FC = () => {
  const { filteredTodos } = useContext(TodosContext);

  return (
    <>
      {filteredTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </>
  );
};
