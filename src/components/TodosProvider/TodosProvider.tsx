import React, {
  createContext,
  useContext,
  FC,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { Todo } from '../../types/Todo';
import { FilterStatus } from '../../types/FilterStatus';
import { getTodos } from '../../api/todos';
import * as todoService from '../../api/todos';
import { errorMessages } from '../ErrorNotification';
import { TodosContextType } from '../../types/contextTypes';
import {
  initialFilterStatus,
  initialTodos,
} from '../../types/initialContextValues';
import { getFilteredTodos } from '../../utils/getFilteredTodos';

interface Props {
  children: React.ReactNode;
}

const TodosContext = createContext<TodosContextType>({
  todos: initialTodos,
  setTodos: () => {},
  filterStatus: initialFilterStatus,
  setFilterStatus: () => {},
  filteredTodos: [],
  isLoading: false,
  errorMessage: '',
  setErrorMessage: () => {},
  isLoadingData: false,
  setIsLoading: () => {},
  selectedTodoIds: [],
  setSelectedTodoIds: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  createNewTodo: () => {},
  newTodoTitle: '',
  setNewTodoTitle: () => {},
  deleteTodo: () => {},
  clearCompletedTodos: () => {},
});

export const useTodos = () => useContext(TodosContext);

export const TodosProvider: FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  const [selectedTodoIds, setSelectedTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const [filterStatus, setFilterStatus] =
    useState<FilterStatus>(initialFilterStatus);

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const filteredTodos = getFilteredTodos(todos, filterStatus);

  useEffect(() => {
    setIsLoadingData(true);

    getTodos()
      .then(data => {
        setTodos(data);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
      })
      .finally(() => setIsLoadingData(false));
  }, []);

  const createNewTodo = useCallback(
    async (title: string) => {
      try {
        setIsLoading(true);
        setSelectedTodoIds([...selectedTodoIds, todoService.USER_ID]);

        setTempTodo({
          id: todoService.USER_ID,
          userId: todoService.USER_ID,
          title,
          completed: false,
        });

        const newTodo = await todoService.createTodo({
          userId: todoService.USER_ID,
          title,
          completed: false,
        });

        setNewTodoTitle('');

        setTodos(currentTodos => [...currentTodos, newTodo]);
      } catch (error) {
        setSelectedTodoIds((ids: number[]) =>
          ids.filter(id => id !== todoService.USER_ID),
        );
        setErrorMessage(errorMessages.unableToAddTodo);
      } finally {
        setIsLoading(false);
        setSelectedTodoIds((ids: number[]) =>
          ids.filter(id => id !== todoService.USER_ID),
        );
        setTempTodo(null);
      }
    },
    [selectedTodoIds],
  );

  const deleteTodo = useCallback(async (todoId: number) => {
    setErrorMessage('');

    try {
      setSelectedTodoIds(currentIds => [...currentIds, todoId]);

      await todoService.deleteTodo(todoId);
      setTodos(prevTodos =>
        prevTodos.filter(todoItem => todoItem.id !== todoId),
      );
    } catch (error) {
      setSelectedTodoIds(ids => ids.filter(id => id !== todoId));
      setErrorMessage(errorMessages.unableToDeleteTodo);
    } finally {
      setSelectedTodoIds(ids => ids.filter(id => id !== todoId));
    }
  }, []);

  const clearCompletedTodos = useCallback(async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    for (const completedTodo of completedTodos) {
      try {
        await todoService.deleteTodo(completedTodo.id);

        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== completedTodo.id),
        );
      } catch (error) {
        setErrorMessage(errorMessages.unableToDeleteTodo);
      }
    }
  }, [todos]);

  return (
    <TodosContext.Provider
      value={{
        isLoading,
        setIsLoading,
        todos,
        setTodos,
        filterStatus,
        setFilterStatus,
        filteredTodos,
        errorMessage,
        setErrorMessage,
        isLoadingData,
        selectedTodoIds,
        setSelectedTodoIds,
        tempTodo,
        setTempTodo,
        createNewTodo,
        newTodoTitle,
        setNewTodoTitle,
        deleteTodo,
        clearCompletedTodos,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
