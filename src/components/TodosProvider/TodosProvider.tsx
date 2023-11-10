import React, {
  useState,
  useMemo,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { Todo } from '../../types/Todo';
import {
  getTodos, postTodo, deleteTodo,
} from '../../api/todos';

import { USER_ID } from '../../utils/constants';
import { NoIdTodo } from '../../types/NoIdTodo';
import { getFilteredTodos } from '../../utils/getFilteredTodos';
import { FilterType } from '../../types/FilterType';

interface TodosContextType {
  todosFromServer: Todo[];
  todosError: string;
  isEditing: boolean;
  filteredTodos: Todo[];
  filter: FilterType;
  responceTodo: Todo | string;
  tempTodo: Todo | null;
  processingTodoIds: number[];
  setTodosError: (error: string) => void;
  addTodoHandler: (newTodo: NoIdTodo) => void;
  deleteTodoHandler: (updatedTodoId: number) => void;
  onFilterChange: (newFilter: FilterType) => void;
  setProcessingTodoIds: (updatedTodoArr: number[]) => void;
}

export const TodosContext = React.createContext<TodosContextType>({
  todosFromServer: [],
  todosError: '',
  isEditing: false,
  filteredTodos: [],
  filter: FilterType.all,
  responceTodo: 'default',
  tempTodo: null,
  processingTodoIds: [0],
  setTodosError: () => {},
  addTodoHandler: () => {},
  deleteTodoHandler: () => {},
  onFilterChange: () => {},
  setProcessingTodoIds: () => {},
});

export const TodosProvider = ({ children }: { children: ReactNode }) => {
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([0]);
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [responceTodo, setResponceTodo] = useState<Todo | string>('default');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todosError, setTodosError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState(FilterType.all);

  const onFilterChange = useCallback((newFilter: FilterType) => {
    setFilter(newFilter);
  }, []);

  const filteredTodos = useMemo(
    () => getFilteredTodos(filter, todosFromServer),
    [filter, todosFromServer],
  );

  useEffect(() => {
    setIsEditing(true);
    getTodos(USER_ID)
      .then((data) => {
        setTodosFromServer(data);
      })
      .catch(() => {
        setTodosError('Unable to load todos');
      })
      .finally(() => setIsEditing(false));
  }, []);

  const addTodoHandler = useCallback(async (newTodo: NoIdTodo) => {
    setTodosError('');
    setIsEditing(true);
    setTempTodo({
      ...newTodo,
      id: 0,
    });

    try {
      const createdTodo = await postTodo(newTodo);

      setTempTodo(null);
      setResponceTodo(createdTodo);
      setTodosFromServer(prevTodos => [...prevTodos, createdTodo]);
    } catch (error) {
      setTempTodo(null);
      setTodosError('Unable to add a todo');

      throw new Error('Some error');
    } finally {
      setIsEditing(false);
    }
  }, []);

  const deleteTodoHandler = useCallback(async (id: number) => {
    setIsEditing(true);
    setTodosError('');
    setProcessingTodoIds(prev => [...prev, id]);

    try {
      const isTodoDelete = await deleteTodo(id);

      if (isTodoDelete) {
        setTodosFromServer(prev => prev.filter(todo => todo.id !== id));
      } else {
        setTodosError('Unable to delete a todo');
      }
    } catch (e) {
      setTodosError('Unable to delete a todo');
    } finally {
      setProcessingTodoIds(prev => prev.filter(todoId => todoId !== id));
      setIsEditing(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      todosFromServer,
      todosError,
      isEditing,
      filteredTodos,
      filter,
      responceTodo,
      tempTodo,
      processingTodoIds,
      setTodosError,
      addTodoHandler,
      deleteTodoHandler,
      onFilterChange,
      setProcessingTodoIds,
    }),
    [
      todosFromServer,
      todosError,
      isEditing,
      filteredTodos,
      filter,
      responceTodo,
      tempTodo,
      processingTodoIds,
      setTodosError,
      addTodoHandler,
      deleteTodoHandler,
      onFilterChange,
      setProcessingTodoIds,
    ],
  );

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};
