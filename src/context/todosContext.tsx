import React, { useEffect, useState } from 'react';
import { createTodo, deleteTodo, getTodos } from '../api/todos';
import { wait } from '../utils/fetchClient';
import { FilterBy, Todo } from '../types/Todo';

export const USER_ID = 11144;

interface UpdateTodos {
  onAddTodo: (event: React.FormEvent) => void;
  onDeleteTodo: (deletedTodo: Todo) => void;
  onDeleteCompletedTodos: () => void;
  setSelectedTodos: (todos: Todo[] | ((todos: Todo[]) => Todo[])) => void;
  setNewTodoTitle: (title: string) => void;
  setIsNotificationOpen: (value: boolean) => void;
  setFilterBy: (filter: FilterBy) => void;
}

export const UpdateTodosContext = React.createContext<UpdateTodos>({
  onAddTodo: () => {},
  onDeleteTodo: () => {},
  onDeleteCompletedTodos: () => {},
  setSelectedTodos: () => {},
  setNewTodoTitle: () => {},
  setIsNotificationOpen: () => {},
  setFilterBy: () => {},
});

interface Todos {
  todos: Todo[];
  isSomeTodosCompleted: boolean;
  isAllTodosCompleted: boolean;
  tempTodo: Todo | null;
  selectedTodos: Todo[];
  newTodoTitle: string;
  isNotificationOpen: boolean;
  filterBy: FilterBy;
  loading: boolean;
  errorMessage: string;
  USER_ID: number;
}

export const TodosContext = React.createContext<Todos>({
  todos: [],
  isSomeTodosCompleted: false,
  isAllTodosCompleted: false,
  tempTodo: null,
  selectedTodos: [],
  newTodoTitle: '',
  isNotificationOpen: false,
  filterBy: FilterBy.ALL,
  loading: false,
  errorMessage: '',
  USER_ID,
});

interface Props {
  children: React.ReactNode;
}

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.ALL);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [selectedTodos, setSelectedTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  function showNotificationBlock() {
    setIsNotificationOpen(true);

    wait(3000)
      .then(() => {
        setIsNotificationOpen(false);
        setErrorMessage('');
      });
  }

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Can not load data');
        showNotificationBlock();
      });
  }, []);

  const isSomeTodosCompleted = todos.some(todo => todo.completed);
  const isAllTodosCompleted = todos.every(todo => todo.completed);

  const onAddTodo = (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedQuery = newTodoTitle.trim();

    if (!normalizedQuery) {
      setErrorMessage('Title can\'t be empty');
      showNotificationBlock();

      return 0;
    }

    setLoading(true);

    const createdTodo = {
      id: 0,
      completed: false,
      title: normalizedQuery,
      userId: USER_ID,
    };

    setTempTodo(() => createdTodo);

    createTodo(createdTodo)
      .then((newTodo) => {
        setNewTodoTitle('');
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        showNotificationBlock();
        setTempTodo(null);
        throw new Error('Unable to add a todo');
      })
      .finally(() => setLoading(false));

    return 0;
  };

  const onDeleteTodo = (deletedTodo: Todo) => {
    setLoading(true);
    setSelectedTodos(currentTodos => [...currentTodos, deletedTodo]);

    deleteTodo(deletedTodo.id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(
          todo => todo.id !== deletedTodo.id,
        ));
        setSelectedTodos(currentTodos => currentTodos.filter(
          todo => deletedTodo.id === todo.id,
        ));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        showNotificationBlock();
        throw new Error('Unable to delete a todo');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onDeleteCompletedTodos = () => {
    const promises = todos.filter(todo => todo.completed)
      .map(todo => onDeleteTodo(todo));

    Promise.all(promises)
      .catch(() => {
        setErrorMessage('Unable to delete completed todos');
        showNotificationBlock();
        throw new Error('Unable to delete completed todos');
      });
  };

  const todosValues = {
    todos,
    isSomeTodosCompleted,
    isAllTodosCompleted,
    tempTodo,
    selectedTodos,
    newTodoTitle,
    isNotificationOpen,
    filterBy,
    loading,
    errorMessage,
    USER_ID,
  };

  const updateTodosValues = {
    onAddTodo,
    onDeleteTodo,
    onDeleteCompletedTodos,
    setSelectedTodos,
    setNewTodoTitle,
    setIsNotificationOpen,
    setFilterBy,
  };

  return (
    <UpdateTodosContext.Provider value={updateTodosValues}>
      <TodosContext.Provider value={todosValues}>
        {children}
      </TodosContext.Provider>
    </UpdateTodosContext.Provider>
  );
};
