/*eslint-disable*/
import React, { createContext, useEffect, useState } from "react";
import { USER_ID } from "../App";
import { deleteTodo, getTodos, postTodo } from "../api/todos";
import { SORT } from "../types/SortEnum";
import { Todo } from "../types/Todo";

interface IContext {
  todos: Todo[];
  sortField: SORT;
  error: string;
  updateSortField: (term: SORT) => void;
  onCloseError: () => void;
  todoLoading: boolean;
  tempTodo: Todo | null;
  onAddNewTodo: (todo: Todo) => void;
  onDeleteTodo: (todoId: number) => void;
}

export const TodosContext = createContext<IContext>({
  todos: [],
  sortField: SORT.ALL,
  error: "",
  updateSortField: () => {},
  onCloseError: () => {},
  todoLoading: false,
  tempTodo: null,
  onAddNewTodo: () => {},
  onDeleteTodo: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoLoading, setTodoLoading] = useState(false);
  const [sortField, setSortField] = useState<SORT>(SORT.ALL);
  const [todosError, setTodosError] = useState("");
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then((serverTodos) => setTodos(serverTodos))
      .catch(() => setTodosError("Unable to fetch a todo"));
  }, []);

  const updateSortField = (term: SORT) => {
    setSortField(term);
  };

  const onCloseError = () => {
    setTodosError("");
  };

  const onAddNewTodo = async (todo: Todo) => {
    setTodoLoading(true);
    const { userId, completed, title } = todo;
    setTempTodo({ userId, completed, title, id: 0 });

    try {
      const responce = await postTodo(USER_ID, { userId, completed, title });

      setTodos((prev) => [...prev, responce]);
    } catch (error) {
      setTodosError("Unable to add a todo");

      return;
    } finally {
      setTodoLoading(false);
      setTempTodo(null);
    }
  };

  const onDeleteTodo = async (todoId: number) => {
    try {
      await deleteTodo(todoId);

      setTodos((currentTodos) =>
        currentTodos.filter((todo) => todo.id !== todoId)
      );
    } catch {
      setTodosError("Unable to delete a todo");

      return;
    }
  };

  const value = {
    todos,
    sortField,
    updateSortField,
    onCloseError,
    error: todosError,
    tempTodo,
    todoLoading,
    onAddNewTodo,
    onDeleteTodo,
  };
  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};
