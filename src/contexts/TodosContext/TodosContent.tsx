import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Todo } from '../../types/Todo';
import { addTodo, deleteTodo, getTodos } from '../../api/todos';
import { USER_ID } from '../../constans';
import { FilterType } from '../../types/FilterType';
import { FilterContext } from '../FilterContext';

const getFilteredTodos = (todos: Todo[], filterType: FilterType) => {
  return todos.filter(todo => {
    switch (filterType) {
      case FilterType.All:
        return todo;

      case FilterType.Active:
        return !todo.completed;

      case FilterType.Completed:
        return todo.completed;

      default: throw new Error('Wrong filter type!');
    }
  });
};

export const TodosContext = createContext<{
  todos: Todo[],
  filteredTodos: Todo[],
  waitingForResponseTodosId: number[],
  errorNotification: string,
  tempTodo: Todo | null,
  loadTodos:() => Promise<void>,
  createTodo:(todoTitle: string) => Promise<void>,
  removeTodos:(todosId: number[]) => Promise<void>,
}>({
      todos: [],
      filteredTodos: [],
      errorNotification: '',
      tempTodo: null,
      waitingForResponseTodosId: [],
      loadTodos: async () => {},
      createTodo: async () => {},
      removeTodos: async () => {},
    });

interface Props {
  children: React.ReactNode;
}

export const TodosContextProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorNotification, setErrorNotification] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [
    waitingForResponseTodosId,
    setWaitingForResponseTodosId,
  ] = useState<number[]>([]);

  const { filterType } = useContext(FilterContext);

  const filteredTodos: Todo[] = useMemo(() => (
    getFilteredTodos(todos, filterType)), [todos, filterType]);

  const loadTodos = useCallback(async () => {
    setErrorNotification('');
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setErrorNotification('Error on loading');
    }
  }, []);

  const createTodo = useCallback(async (todoTitle: string) => {
    if (!todoTitle) {
      setErrorNotification('Title can`t be empty');

      return;
    }

    setErrorNotification('');

    try {
      const newTodo = {
        title: todoTitle,
        userId: USER_ID,
        completed: false,
      };

      await addTodo(USER_ID, newTodo);

      setTempTodo({ ...newTodo, id: 0 });

      await loadTodos();
    } catch {
      setErrorNotification('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  }, []);

  const removeTodos = useCallback(async (todosId: number[]) => {
    setErrorNotification('');
    try {
      setWaitingForResponseTodosId([
        ...waitingForResponseTodosId,
        ...todosId,
      ]);

      await Promise.all(
        todosId.map(async (id) => {
          await deleteTodo(id);
        }),
      );

      await loadTodos();
    } catch {
      setErrorNotification('Unable to delete a todo');
    } finally {
      setWaitingForResponseTodosId([]);
    }
  }, []);

  return (
    <TodosContext.Provider value={{
      todos,
      filteredTodos,
      errorNotification,
      tempTodo,
      waitingForResponseTodosId,
      loadTodos,
      createTodo,
      removeTodos,
    }}
    >
      {children}
    </TodosContext.Provider>
  );
};
