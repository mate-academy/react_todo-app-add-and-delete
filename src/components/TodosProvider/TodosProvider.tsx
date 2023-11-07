import React, {
  useState,
  useMemo,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { Todo } from "../../types/Todo";
import { getTodos } from "../../api/todos";
import { postTodo } from "../../api/todos";
import { updateTodo } from "../../api/todos";
import { deleteTodo } from "../../api/todos";
import { USER_ID } from "../../utils/constants";
import { NoIdTodo } from "../../types/NoIdTodo";
import { getFilteredTodos } from "../../utils/getFilteredTodos";
import { FilterType } from "../../types/FilterType";

interface TodosContextType {
  todosFromServer: Todo[];
  todosError: string;
  isShowErrors: boolean;
  isLoaded: boolean;
  filteredTodos: Todo[];
  filter: FilterType;
  setTodosError: (error: string) => void;
  setIsShowErrors: React.Dispatch<React.SetStateAction<boolean>>;
  addTodoHandler: (newTodo: NoIdTodo) => void;
  updateTodoHandler: (updatedTodo: Todo) => void;
  deleteTodoHandler: (updatedTodo: Todo) => void;
  onFilterChange: (newFilter: FilterType) => void;
}

export const TodosContext = React.createContext<TodosContextType>({
  todosFromServer: [],
  todosError: "",
  isShowErrors: false,
  isLoaded: false,
  filteredTodos: [],
  filter: FilterType.all,
  setTodosError:() => {},
  setIsShowErrors: () => {},
  addTodoHandler: () => {},
  updateTodoHandler: () => {},
  deleteTodoHandler: () => {},
  onFilterChange: () => {},
});

export const TodosProvider = ({ children }: { children: ReactNode }) => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [todosError, setTodosError] = useState("");
  const [isShowErrors, setIsShowErrors] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [filter, setFilter] = useState(FilterType.all);

  const onFilterChange = (newFilter: FilterType) => {
    console.log("newFilter", newFilter);
    setFilter(newFilter);
  };

  const filteredTodos = useMemo(
    () => getFilteredTodos(filter, todosFromServer),
    [filter, todosFromServer]
  );

  const gettingData = useCallback(() => {
    getTodos(USER_ID)
      .then((data) => {
        setTodosFromServer(data);
      })
      .catch(() => {
        setTodosError('Unable to load todos');
        setIsShowErrors(true);
      })
      .finally(() => setIsLoaded(true));
  },[]);
  useEffect(() => {
    console.info("START");
    gettingData();
  }, []);

  const addTodoHandler = useCallback((newTodo: NoIdTodo) => {
    const temporaryTodo = {
      ...newTodo,
      id: Date.now(),
    };
    console.log("POST", newTodo);

    postTodo(USER_ID, newTodo)
      .then((todo) => {
        setTodosFromServer((prev) =>
          prev.map((prevTodo) =>
            prevTodo.id === temporaryTodo.id ? todo : prevTodo
          )
        );
      })
      .catch(() =>
        setTodosFromServer((prev) =>
          prev.filter((prevTodo) => prevTodo.id !== temporaryTodo.id)
        )
      );

    setTodosFromServer((prev) => [temporaryTodo, ...prev]);
  }, []);

  const updateTodoHandler = useCallback((updatedTodo: Todo) => {
    let prevTodo: Todo | null = null;

    updateTodo(updatedTodo).catch(() => {
      setTodosFromServer((prev) =>
        prev.map((todo) =>
          todo.id === updatedTodo.id && prevTodo ? prevTodo : todo
        )
      );
    });

    setTodosFromServer((currentTodos) =>
      currentTodos.map((todo) => {
        if (todo.id === updatedTodo.id) {
          prevTodo = todo;
        }

        return todo.id === updatedTodo.id ? updatedTodo : todo;
      })
    );
  }, []);

  const deleteTodoHandler = useCallback((updatedTodo: Todo) => {
    let prevTodo: Todo | null = null;

    deleteTodo(updatedTodo).catch(() => {
      setTodosFromServer((prev) =>
        prev.filter((todo) => todo.id !== updatedTodo.id)
      );
    });

    setTodosFromServer((currentTodos) =>
      currentTodos.filter((todo) => {
        if (todo.id === updatedTodo.id) {
          prevTodo = todo;
          console.log(prevTodo);
          return false;
        } else {
          return true;
        }
      })
    );
  }, []);

  const value = useMemo(
    () => ({
      todosFromServer,
      todosError,
      isShowErrors,
      isLoaded,
      filteredTodos,
      filter,
      setTodosError,
      setIsShowErrors,
      addTodoHandler,
      updateTodoHandler,
      deleteTodoHandler,
      onFilterChange,
    }),
    [
      todosFromServer,
      isLoaded,
      todosError,
      filteredTodos,
      filter,
      isShowErrors,
      todosError,
    ]
  );
  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};
