/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable no-redeclare */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  createContext,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Todo } from './types/Todo';
import { FilterBy } from './types/Filter';
import { ErrorType } from './types/Errors';
import * as todoService from './api/todos';
import { USER_ID } from './utils/userId';

interface AppContext {
  todos: Todo[],
  setTodos: (todos: Todo[]) => void,
  filterBy: FilterBy,
  setFilterBy: (arg: FilterBy) => void,
  errorMessage: ErrorType | null,
  setErrorMessage: (arg: ErrorType | null) => void,
  clearCompleted: () => void,
  selectedTodoIds: number[],
  setSelectedTodoIds: (arg: number[]) => void
  todoTitle: string,
  setTodoTitle: (arg: string) => void,
  isLoading: boolean,
  createNewTodo: (title: string) => void,
  tempTodo: Todo | null,
  setTempTodo: (arg: Todo | null) => void,
  deleteTodo: (arg: number) => void,

}
export const AppContext = createContext<AppContext>({
  todos: [],
  setTodos: () => { },
  filterBy: FilterBy.All,
  setFilterBy: () => { },
  errorMessage: null,
  setErrorMessage: () => { },
  clearCompleted: () => { },
  selectedTodoIds: [],
  setSelectedTodoIds: () => { },
  todoTitle: '',
  setTodoTitle: () => { },
  isLoading: false,
  createNewTodo: () => { },
  tempTodo: null,
  setTempTodo: () => { },
  deleteTodo: () => { },
});

type Props = {
  children: React.ReactNode
};

export const AppProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorType | null>(null);
  const [filterBy, setFilterBy] = useState(FilterBy.All);
  const [selectedTodoIds, setSelectedTodoIds] = useState<number[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const clearCompleted = useCallback(
    () => {
      const completedTodos = todos
        .filter(todoToFind => todoToFind.completed);

      setSelectedTodoIds(currentIds => (
        [...currentIds, ...completedTodos
          .map(completedTodo => completedTodo.id),
        ]
      ));

      completedTodos.map(completedTodo => todoService
        .deletTodo(completedTodo.id));

      setTimeout(() => {
        setTodos(currentTodos => currentTodos.filter(
          todoToFilter => !todoToFilter.completed,
        ));
      }, 500);
    }, [todos],
  );

  const createNewTodo = (title: string) => {
    setIsLoading(true);
    setSelectedTodoIds(ids => [...ids, 0]);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    todoService.createTodo({
      userId: USER_ID,
      title,
      completed: false,
    })
      .then(newTodo => {
        setTodoTitle('');
        setTimeout(() => {
          setTodos(currentTodo => [...currentTodo, newTodo]);
        }, 500);
      })
      .catch(() => {
        setSelectedTodoIds(ids => ids.filter(
          id => id !== 0,
        ));
        setErrorMessage(ErrorType.UnableToAddTodo);
        setTimeout(() => setErrorMessage(null), 2000);
      })
      .finally(() => {
        setIsLoading(false);
        setSelectedTodoIds(ids => ids.filter(
          id => id !== 0,
        ));
        setTimeout(() => setTempTodo(null), 500);
      });
  };

  const deleteTodo = useCallback(
    (todoId: number) => {
      setSelectedTodoIds(currentIds => [...currentIds, todoId]);
      todoService.deletTodo(todoId)
        .then(() => {
          setTimeout(() => {
            setTodos(currentTodos => currentTodos
              .filter(post => post.id !== todoId));
          }, 500);
        })
        .catch(() => {
          setSelectedTodoIds(ids => {
            ids.splice(ids.indexOf(todoId), 1);

            return ids;
          });
          setErrorMessage(ErrorType.UnableToDeleteTodo);
          setTimeout(() => setErrorMessage(null), 2000);
        })
        .finally(() => setTimeout(
          () => setSelectedTodoIds(ids => ids.splice(ids.indexOf(todoId), 1)),
          500,
        ));
    }, [],
  );

  const value = useMemo(() => ({
    todos,
    setTodos,
    filterBy,
    setFilterBy,
    errorMessage,
    setErrorMessage,
    clearCompleted,
    setSelectedTodoIds,
    todoTitle,
    isLoading,
    createNewTodo,
    setTodoTitle,
    tempTodo,
    deleteTodo,
    selectedTodoIds,
    setTempTodo,

  }), [
    todos,
    setTodos,
    filterBy,
    setFilterBy,
    errorMessage,
    setErrorMessage,
    clearCompleted,
    setSelectedTodoIds,
    todoTitle,
    isLoading,
    createNewTodo,
    setTodoTitle,
    tempTodo,
    deleteTodo,
    selectedTodoIds,
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
