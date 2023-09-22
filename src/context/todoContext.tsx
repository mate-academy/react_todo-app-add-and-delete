import React, { useEffect, useMemo, useState } from 'react';
import { Todo } from '../types/Todo';
import * as todoService from '../api/todos';
import { ErrorType, SelectType } from '../enums';
import { selectTodos } from '../utils/selectTodos';
import { USER_ID } from '../consts';

interface Context {
  todos: Todo[];
  tempTodo: Todo | null;
  itemsLeft: number;
  loading: boolean;
  visibleFooter: number;
  visibleButtonClearCompleted: number;
  error: ErrorType | null;
  select: SelectType;
  selectedTodoIds: number[];
  onDeleteTodo: (todoId: number) => void;
  onAddTodo: (title: string) => void;
  onErrorHandler: (value: ErrorType | null) => void;
  onSelect: (value: SelectType) => void;
  onDeleteCompletedTodos: () => void;
}

export const TodoContext = React.createContext<Context>({
  todos: [],
  tempTodo: {} as Todo | null,
  error: null,
  itemsLeft: 0,
  loading: false,
  visibleFooter: 0,
  visibleButtonClearCompleted: 0,
  select: SelectType.All,
  selectedTodoIds: [],
  onDeleteTodo: () => {},
  onAddTodo: () => {},
  onErrorHandler: () => {},
  onSelect: () => {},
  onDeleteCompletedTodos: () => {},
});

type Props = {
  children: React.ReactNode
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorType | null>(null);
  const [select, setSelect] = useState(SelectType.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTodoIds, setSelectedTodoIds] = useState<number[]>([]);

  const getTodos = async () => {
    setLoading(true);
    try {
      const allTodos = await todoService.getTodos(USER_ID);

      setTodos(allTodos);
    } catch {
      setError(ErrorType.IncorectUrl);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  const selectedTodos = selectTodos(todos, select);

  const deleteTodo = (todoId: number) => {
    setLoading(true);
    todoService.deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos
          .filter(todo => todo.id !== todoId));
      })
      .catch(() => setError(ErrorType.DeleteError))
      .finally(() => setLoading(false));
  };

  const addTodo = (title: string) => {
    setLoading(true);

    const newTodo = {
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo);

    todoService.createTodo(newTodo)
      .then(todo => {
        setTodos(currenTodos => [...currenTodos, todo]);
      })
      .catch(() => setError(ErrorType.AddError))
      .finally(() => {
        setTempTodo(null);
        setLoading(false);
      });
  };

  const onDeleteCompletedTodos = async () => {
    setError(null);

    try {
      const completedTodosIds = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      setSelectedTodoIds(completedTodosIds);

      const deleteTasks = completedTodosIds.map(todoId => (
        deleteTodo(todoId)
      ));

      await Promise.all(deleteTasks);

      setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
    } catch {
      setError(ErrorType.DeleteError);
    } finally {
      setSelectedTodoIds([]);
    }
  };

  const itemsLeft = selectedTodos.filter(todo => !todo.completed).length;
  const visibleFooter = todos.length;
  const visibleButtonClearCompleted = selectedTodos.filter(
    (todo) => todo.completed,
  ).length;

  const value: Context = useMemo(() => ({
    todos: selectedTodos,
    itemsLeft,
    loading,
    visibleFooter,
    visibleButtonClearCompleted,
    error,
    selectedTodoIds,
    tempTodo,
    select,
    onDeleteTodo: deleteTodo,
    onAddTodo: addTodo,
    onErrorHandler: setError,
    onSelect: setSelect,
    onDeleteCompletedTodos,
  }), [selectedTodos, error, select]);

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
