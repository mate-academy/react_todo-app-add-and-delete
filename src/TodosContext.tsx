import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as todosApi from './api/todos';
import { Errors } from './types/Errors';
import { Status } from './types/Status';
import { Todo } from './types/Todo';
import { TodosContextType } from './types/TodosContextType';

export const USER_ID = 11543;

type Props = {
  children: React.ReactNode;
};

export const TodosContext = React.createContext<TodosContextType>({
  todos: [],
  setTodos: () => { },
  addTodo: () => { },
  toggleTodo: () => { },
  toggleAll: () => { },
  clearCompleted: () => { },
  updateTodoTitle: () => { },
  selectedStatus: Status.All,
  setSelectedStatus: () => { },
  errorMessage: '',
  setErrorMessage: () => { },
  removeErrorIn3sec: () => { },
  notCompletedTodos: 0,
  tempTodo: null,
  isSubmiting: false,
  setIsSubmiting: () => { },
  title: '',
  setTitle: () => { },
  completedTodosIds: [],
  deletingIds: [],
  setDeletingIds: () => {},
  deleteTodo: () => {},
});

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [selectedStatus, setSelectedStatus] = useState(Status.All);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const removeErrorIn3sec = () => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    todosApi.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Errors.loading);

        removeErrorIn3sec();
      });
  }, []);

  const addTodo = (currentTitle: string) => {
    setIsSubmiting(true);
    setErrorMessage('');

    const newTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: currentTitle,
      completed: false,
    };

    setTempTodo({
      ...newTodo,
      id: 0,
    });

    todosApi.createTodo(newTodo)
      .then(createdTodo => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(Errors.adding);
        removeErrorIn3sec();
      })
      .finally(() => {
        setTempTodo(null);
        setIsSubmiting(false);
      });
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(currTodo => (currTodo.id === id
      ? { ...currTodo, completed: !currTodo.completed }
      : currTodo)));
  };

  const updateTodoTitle = (id: number, newTitle: string) => {
    setTodos(todos.map(prevTodo => (prevTodo.id === id
      ? { ...prevTodo, title: newTitle }
      : prevTodo)));
  };

  const toggleAll = () => {
    const hasAllCompleted = todos.every(todo => todo.completed);

    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !hasAllCompleted,
    }));

    setTodos(updatedTodos);
  };

  const deleteTodo = (todoId: number) => {
    setDeletingIds((ids) => [...ids, todoId]);

    todosApi.deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(
          item => item.id !== todoId,
        ));
      })
      .catch(() => {
        setErrorMessage(Errors.deleting);

        removeErrorIn3sec();
      })
      .finally(() => setDeletingIds((ids) => ids.filter(id => id !== todoId)));
  };

  const completedTodosIds = useMemo(() => {
    return todos
      .filter(item => item.completed)
      .map(el => el.id);
  }, [todos]);

  const clearCompleted = () => {
    todos.filter(todo => todo.completed).forEach((todo) => {
      deleteTodo(todo.id);
    });
  };

  const notCompletedTodos = useMemo(() => {
    return todos.filter(item => !item.completed).length;
  }, [todos]);

  return (
    <TodosContext.Provider
      value={{
        todos,
        setTodos,
        addTodo,
        toggleTodo,
        toggleAll,
        clearCompleted,
        updateTodoTitle,
        selectedStatus,
        setSelectedStatus,
        errorMessage,
        setErrorMessage,
        removeErrorIn3sec,
        notCompletedTodos,
        tempTodo,
        isSubmiting,
        setIsSubmiting,
        title,
        setTitle,
        completedTodosIds,
        deletingIds,
        setDeletingIds,
        deleteTodo,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};

export const useTodos = () => useContext(TodosContext);
