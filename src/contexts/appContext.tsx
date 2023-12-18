import React, {
  createContext,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Todo } from '../types/Todo';
import * as todoService from '../api/todos';
import { USER_ID } from '../utils/userId';
import { FilterBy } from '../types/FilterBy';
import { ErrorType } from '../types/ErrorType';

interface AppContextType {
  todosFromServer: Todo[],
  tempTodo: Todo | null,
  filterBy: FilterBy,
  errorMessage: ErrorType | null,
  todoTitle: string,
  todoTitleDisabled: boolean,
  selectedTodoIds: number[],
  isLoading: boolean,
  displayError: (error: ErrorType) => void,
  setSelectedTodoIds: (arg: number[]) => void
  setTodoTitle: (todoTitle: string) => void,
  setTodoTitleDisabled: (isDisabled: boolean) => void,
  setTodosFromServer: (todosFromServer: Todo[]) => void,
  setFilterBy: React.Dispatch<React.SetStateAction<FilterBy>>
  setErrorMessage: (errorMessage: ErrorType | null) => void,
  setTempTodo: (tempTodo: Todo | null) => void,
  createNewTodo: (title: string) => void,
  removeTodo: (todoId: number) => void,
  clearCompleted: () => void,
  setIsLoading: (arg: boolean) => void,
}

export const AppContext = createContext<AppContextType>({
  todosFromServer: [],
  tempTodo: null,
  filterBy: FilterBy.All,
  errorMessage: ErrorType.None,
  isLoading: false,
  todoTitle: '',
  todoTitleDisabled: false,
  selectedTodoIds: [],
  displayError: () => { },
  setSelectedTodoIds: () => { },
  setTodoTitle: () => { },
  setTodoTitleDisabled: () => { },
  setTodosFromServer: () => { },
  setFilterBy: () => { },
  setErrorMessage: () => { },
  setTempTodo: () => { },
  createNewTodo: () => { },
  removeTodo: () => { },
  clearCompleted: () => { },
  setIsLoading: () => { },
});

type Props = {
  children: React.ReactNode
};

export const AppProvider: React.FC<Props> = ({ children }) => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(FilterBy.All);
  const [errorMessage, setErrorMessage] = useState<ErrorType | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [todoTitle, setTodoTitle] = useState('');
  const [selectedTodoIds, setSelectedTodoIds] = useState<number[]>([]);
  const [todoTitleDisabled, setTodoTitleDisabled] = useState(false);

  const displayError = useCallback((error: ErrorType) => {
    setErrorMessage(error);
    const timeoutId = setTimeout(() => setErrorMessage(null), 3000);

    return () => clearTimeout(timeoutId);
  }, [setErrorMessage]);

  const removeTodo = useCallback(
    async (todoId: number) => {
      try {
        setSelectedTodoIds(currentIds => [...currentIds, todoId]);

        await todoService.deleteTodo(todoId);

        setTodosFromServer(currentTodos => currentTodos
          .filter(todo => todo.id !== todoId));
      } catch (error) {
        setSelectedTodoIds(ids => ids.filter(id => id !== todoId));
        displayError(ErrorType.UnableToDelete);
      } finally {
        setSelectedTodoIds(ids => ids.filter(id => id !== todoId));
      }
    },
    [displayError, setTodosFromServer, setSelectedTodoIds],
  );

  const createNewTodo = useCallback(async (title: string) => {
    try {
      setIsLoading(true);
      setSelectedTodoIds(ids => [...ids, 0]);

      setTempTodo({
        id: 0,
        userId: USER_ID,
        title,
        completed: false,
      });

      const newTodo = await todoService.postTodo({
        userId: USER_ID,
        title,
        completed: false,
      });

      setTodoTitle('');

      setTodosFromServer(currentTodos => [...currentTodos, newTodo]);
    } catch (error) {
      setSelectedTodoIds(ids => ids.filter(id => id !== 0));
      displayError(ErrorType.UnableToAdd);
    } finally {
      setIsLoading(false);
      setSelectedTodoIds(ids => ids.filter(id => id !== 0));
      setTempTodo(null);
    }
  }, [displayError,
    setTodosFromServer,
    setSelectedTodoIds,
    setIsLoading,
    setTempTodo,
    setTodoTitle]);

  const updateTodo = useCallback(
    async (todo: Todo) => {
      try {
        await todoService.patchTodo(todo);
      } catch (error) {
        displayError(ErrorType.UnableToUpdate);
      }
    },
    [displayError],
  );

  const clearCompleted = useCallback(
    () => {
      const completedTodos = todosFromServer.filter(
        todoToFind => todoToFind.completed,
      );

      setSelectedTodoIds(currentIds => (
        [...currentIds, ...completedTodos
          .map(completedTodo => completedTodo.id),
        ]
      ));

      completedTodos.map(
        completedTodo => todoService.deleteTodo(completedTodo.id),
      );

      setTimeout(() => {
        setTodosFromServer(currentTodos => currentTodos.filter(
          todoToFilter => !todoToFilter.completed,
        ));
      }, 500);
    }, [todosFromServer],
  );

  const value = useMemo(() => ({
    todosFromServer,
    selectedTodoIds,
    tempTodo,
    filterBy,
    errorMessage,
    isLoading,
    todoTitle,
    todoTitleDisabled,
    displayError,
    setSelectedTodoIds,
    setTodoTitle,
    setTodoTitleDisabled,
    setTodosFromServer,
    setFilterBy,
    setErrorMessage,
    setTempTodo,
    createNewTodo,
    removeTodo,
    updateTodo,
    clearCompleted,
    setIsLoading,
  }), [
    todosFromServer,
    selectedTodoIds,
    tempTodo,
    filterBy,
    errorMessage,
    isLoading,
    todoTitle,
    todoTitleDisabled,
    displayError,
    setTodoTitle,
    setSelectedTodoIds,
    setTodoTitleDisabled,
    setTodosFromServer,
    setFilterBy,
    setErrorMessage,
    setTempTodo,
    createNewTodo,
    removeTodo,
    updateTodo,
    clearCompleted,
    setIsLoading,
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
