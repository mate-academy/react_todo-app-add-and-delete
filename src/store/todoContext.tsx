/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';
import { Todo } from '../types/Todo';
import { Error, SetError, ErrorMsg } from '../types/Error';
import { FilterStatus } from '../types/Filter';
import { deleteTodo, getTodos } from '../api/todos';
import { AuthContext } from '../components/Auth/AuthContext';

interface InitialState {
  todos: Todo[];
  newTodo: string;
  error: Error;
  filter: FilterStatus;
  tempTodo: Todo | null;
}

const initialState: InitialState = {
  todos: [],
  newTodo: '',
  error: [false, ErrorMsg.NoError],
  filter: FilterStatus.All,
  tempTodo: null,
};

const useTodos = (initial: InitialState) => {
  const [todos, setTodos] = useState<Todo[]>(initial.todos);
  const [newTodo, setNewTodo] = useState<string>(initial.newTodo);
  const [error, errorSet] = useState<Error>(initial.error);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    initial.filter,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(initial.tempTodo);
  const [deleting, setDeleting] = useState(false);

  const setError: SetError = (err = false, msg = ErrorMsg.NoError) => {
    errorSet([err, msg]);
  };

  const getNewTodo = (todo: string) => {
    setNewTodo(todo);
  };

  const todoLength = todos.length;

  const user = useContext(AuthContext);

  useEffect(() => {
    setError();

    getTodos(user?.id || 0)
      .then(data => setTodos(prev => [...prev, ...data]))
      .catch(() => setError(true, ErrorMsg.AddError));
  }, []);

  const changeFilterStatus = (status: FilterStatus) => {
    setFilterStatus(status);
  };

  const renewTodos = (todo: Todo) => {
    setTodos(prev => [...prev, todo]);
  };

  const deleteSingleTodo = async (
    id: number,
    isDeleting: Dispatch<SetStateAction<boolean>>,
  ) => {
    isDeleting(true);
    try {
      await deleteTodo(id);
    } catch {
      setError(true, ErrorMsg.DeleteError);
    } finally {
      isDeleting(false);
    }

    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const completedTodos = todos.filter(todo => todo.completed);

  const clearCompletedTodos = () => {
    completedTodos.map(todo => deleteSingleTodo(todo.id, setDeleting));
  };

  const filteredTodos = todos.filter(todo => {
    switch (filterStatus) {
      case FilterStatus.Completed:
        return todo.completed;

      case FilterStatus.Active:
        return !todo.completed;

      default:
        return todo;
    }
  });

  const addTempTodo = (todoTitle = '', userId = 0) => {
    if (todoTitle === '' || userId === 0) {
      setTempTodo(null);

      return;
    }

    const todo = {
      id: 0,
      userId,
      title: todoTitle,
      completed: false,
    };

    setTempTodo(todo);
  };

  return {
    todos: filteredTodos,
    renewTodos,
    todoLength,
    newTodo,
    error,
    setError,
    getNewTodo,
    changeFilterStatus,
    filterStatus,
    tempTodo,
    addTempTodo,
    clearCompletedTodos,
    deleteSingleTodo,
    completedTodos,
    deleting,
  };
};

const TodoContext = createContext<ReturnType<typeof useTodos> | null>(null);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const useTodoContext = () => useContext(TodoContext)!;

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  return (
    <TodoContext.Provider value={useTodos(initialState)}>
      {children}
    </TodoContext.Provider>
  );
};
