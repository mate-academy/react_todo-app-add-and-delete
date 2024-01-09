import React, {
  ReactNode,
  useContext,
  useState,
} from 'react';
import * as todoService from '../api/todos';
import { Errors, Filters, Todo } from '../types';
import { USER_ID } from '../utils/userId';

type TodoContextType = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  filterBy: Filters;
  setFilterBy: (filter: Filters) => void;
  errorMessage: Errors | null;
  setErrorMessage: (error: Errors | null) => void;
  todoTitle: string;
  setTodoTitle: (title: string) => void;
  selectedTodoIds: number[],
  setSelectedTodoIds: (arg: number[]) => void
  loading: boolean;
  deleteTodo: (arg: number) => void;
  createTodo: (title: string) => void;
  tempTodo: Todo | null,
  setTempTodo: (arg: Todo | null) => void,
  editStatus: (todoId: number) => void,
};

const TodoContext = React.createContext<TodoContextType>({
  todos: [],
  setTodos: () => {},
  filterBy: Filters.All,
  setFilterBy: () => {},
  errorMessage: null,
  setErrorMessage: () => {},
  todoTitle: '',
  setTodoTitle: () => {},
  selectedTodoIds: [],
  setSelectedTodoIds: () => { },
  loading: false,
  deleteTodo: () => {},
  createTodo: () => {},
  tempTodo: null,
  setTempTodo: () => { },
  editStatus: () => {},
});

export const TodoProvider: React.FC<{ children: ReactNode }> = (
  { children },
) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<Filters>(Filters.All);
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [selectedTodoIds, setSelectedTodoIds] = useState<number[]>([]);
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  function deleteTodo(todoId: number) {
    setErrorMessage(null);
    setLoading(true);
    setSelectedTodoIds(currentIds => [...currentIds, todoId]);

    return todoService.deleteTodos(todoId)
      .then(() => {
        // локальне оновлення
        setTodos((currentTodos: Todo[]) => currentTodos
          .filter(todo => todo.id !== todoId));
      })
      .catch((error) => {
        setTodos(todos); // значення на момент рендерінгу
        setSelectedTodoIds(ids => ids.filter(id => id !== 0));

        setErrorMessage(Errors.UnableDelete);
        throw error;
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function createTodo(title: string) {
    const newTodoData = {
      userId: USER_ID,
      title,
      completed: false,
    };

    setLoading(true);
    setSelectedTodoIds(ids => [...ids, 0]);
    setTempTodo({
      id: 0,
      ...newTodoData,
    });

    return todoService.createTodos(newTodoData)
      .then(newTodo => {
        setTodoTitle('');
        setTodos(currentTodo => [...currentTodo, newTodo]);
      })
      .catch((error) => {
        setSelectedTodoIds(ids => ids.filter(id => id !== 0));
        setErrorMessage(Errors.UnableAdd);
        throw error;
      })
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
      });
  }

  function editStatus(todoId: number) {
    const updatedTodos = todos
      .map((todo) => (todo.id === todoId
        ? { ...todo, completed: !todo.completed }
        : todo));

    setTodos(updatedTodos);
  }

  const value = {
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    filterBy,
    setFilterBy,
    todoTitle,
    setTodoTitle,
    loading,
    deleteTodo,
    createTodo,
    tempTodo,
    setTempTodo,
    selectedTodoIds,
    setSelectedTodoIds,
    editStatus,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => useContext(TodoContext);
