import {
  FormEventHandler,
  createContext, useContext, useEffect, useState,
} from 'react';
import {
  Errors, Props, TodoContextType,
} from './types';
import { deleteTodo, getTodos, postTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';

const TodoContext = createContext<TodoContextType | undefined>(undefined); // Zmiana na TodoContext
const USER_ID = 11433;

export const ToDoProvider = ({ children }: Props) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Errors | null>(null);
  const [filterTodos, setFilterTodos]
    = useState<FilterType>('all');
  const [newTodoName, setNewTodoName] = useState<string | null>(null);
  const [temptTodo, setTempTodo] = useState<Todo | null>(null);
  const [editedTodo, setEditedTodo] = useState<boolean>(false);

  const handleShowError = (err: Errors) => {
    setError(err);
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  const handleGetTodos = async () => {
    const data = await getTodos(USER_ID);

    setTodos(data);
  };

  useEffect(() => {
    handleGetTodos()
      .catch(() => {
        handleShowError(Errors.Update);
      });
  }, []);

  const handleSetFilterTodos = (filterType: FilterType) => {
    setFilterTodos(filterType);
  };

  const closeErrorMessage = () => {
    setError(null);
  };

  const addNewTodo: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (newTodoName === null) {
      setError(Errors.Title);
    } else {
      const todoToAdd: Todo = {
        id: 0,
        userId: 11433,
        title: newTodoName.trim(),
        completed: false,
      };

      setTodos([...todos, todoToAdd]);
      setTempTodo(todoToAdd);
      postTodo(USER_ID, todoToAdd)
        .then((response) => {
          const addedTodo = response;

          setTodos([...todos, addedTodo]);
          setTempTodo(addedTodo);
          setNewTodoName(null);
        })
        .catch(() => handleShowError(Errors.Title))
        .finally(() => setTempTodo(null));

      setNewTodoName(null);
    }
  };

  const removeTask = (task: Todo) => {
    setTempTodo(task);
    deleteTodo(task.id)
      .then(() => handleGetTodos())
      .catch(() => handleShowError(Errors.Delete))
      .finally(() => setTempTodo(null));
  };

  const deleteCompleted = (tasks: Todo[]) => {
    tasks.forEach((t) => {
      setEditedTodo(true);

      return deleteTodo(t.id)
        .then(() => handleGetTodos())
        .catch(() => handleShowError(Errors.Delete))
        .finally(() => setTempTodo(null));
    });
  };

  return (
    <TodoContext.Provider value={{
      todos,
      error,
      filterTodos,
      newTodoName,
      temptTodo,
      editedTodo,
      setNewTodoName,
      handleShowError,
      handleSetFilterTodos,
      closeErrorMessage,
      addNewTodo,
      removeTask,
      deleteCompleted,
    }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = (): TodoContextType => {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error('useTodo must be used within a ToDoProvider');
  }

  return context;
};
