import React, {
  ChangeEvent,
  useState,
  KeyboardEvent,
  useMemo,
  useEffect,
  SetStateAction,
} from 'react';
import { Todo } from '../types/Todo';
import { Status } from '../services/Status';
import { useLocalStorage } from '../services/localStorage';
import { editTodoFunction } from '../types/EditTodoFunction';
import { ErrorType } from '../types/ErrorType';
import { getTodos } from '../api/todos';
// eslint-disable-next-line import/no-cycle
import { USER_ID } from '../App';
import { client } from '../utils/fetchClient';

type TodoContext = {
  todos: Todo[];
  setTodos: (value: Todo[]) => void;
  toggleAll: boolean;
  setToggleAll: (status: boolean) => void;
  filter: Status;
  setFilter: React.Dispatch<React.SetStateAction<Status>>;
  filteredTodos: Todo[];
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddTodo: () => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  deleteTodo: (id: number) => void;
  clearForm: () => void;
  toggleCompleted: (id: number) => void;
  toggleAllChange: () => void;
  editTodo: editTodoFunction;
  newTodos: string;
  setNewTodos: React.Dispatch<React.SetStateAction<string>>;
  errorMessage: ErrorType;
  setErrorMessage: (error: ErrorType) => void;
  setNotification: (value: boolean) => void;
  notification: boolean;
  closeNotification: () => void;
  USER_ID: number;
  isAddingTodo: boolean;
  setIsAddingTodo: React.Dispatch<SetStateAction<boolean>>;
  tempTodo: Todo | null;
  setTempTodo: React.Dispatch<SetStateAction<Todo | null>>;
};

type Props = {
  children: React.ReactNode;
};

export const TodosContext = React.createContext<TodoContext>({
  todos: [],
  setTodos: () => {},
  toggleAll: false,
  setToggleAll: () => {},
  filter: Status.ALL,
  setFilter: () => {},
  filteredTodos: [],
  handleInputChange: () => {},
  handleAddTodo: () => {},
  handleKeyDown: () => {},
  deleteTodo: () => {},
  clearForm: () => {},
  toggleCompleted: () => {},
  toggleAllChange: () => {},
  editTodo: () => {},
  newTodos: '',
  setNewTodos: () => {},
  errorMessage: ErrorType.None,
  setErrorMessage: () => {},
  notification: false,
  setNotification: () => {},
  closeNotification: () => {},
  USER_ID: 0,
  isAddingTodo: false,
  setIsAddingTodo: () => {},
  tempTodo: null,
  setTempTodo: () => {},
});

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useLocalStorage('todos', [] as Todo[]);
  const [filter, setFilter] = useState<Status>(Status.ALL);
  const [toggleAll, setToggleAll] = useState<boolean>(false);
  const [newTodos, setNewTodos] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<ErrorType>(ErrorType.None);
  const [notification, setNotification] = useState<boolean>(false);
  const [isAddingTodo, setIsAddingTodo] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setNotification(true);
        setErrorMessage(ErrorType.Title);
        setTimeout(() => {
          setNotification(false);
        }, 3000);
      });
  }, [USER_ID]);

  // Filtrate the task according to the selected filter
  const filteredTodos = useMemo(() => {
    if (filter === Status.COMPLETED) {
      return todos.filter(todo => todo.completed);
    }

    if (filter === Status.ACTIVE) {
      return todos.filter(todo => !todo.completed);
    }

    return todos;
  }, [todos, filter]);

  const closeNotification = () => {
    setNotification(false);
  };

  // Update NewTodo Status with Text Task Text
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTodos(event.target.value);
  };

  const sendPostRequest = async (postData: { title: string }) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await client.post<Todo>('/todos', postData);

      return response;
    } catch (error) {
      setErrorMessage(ErrorType.Title);
      throw error;
    }
  };

  // will add a new task to the list
  const handleAddTodo = async () => {
    if (newTodos.trim() === '') {
      setNotification(true);
      setIsAddingTodo(true);
      setTimeout(() => {
        setNotification(false);
      }, 3000);

      return;
    }

    if (tempTodo !== null) {
      return;
    }

    const TempTodo: Todo = {
      id: 0,
      title: newTodos,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(TempTodo);

    const postData = {
      title: newTodos,
      userId: USER_ID,
      completed: false,
    };

    try {
      const response = await sendPostRequest(postData);

      setTodos(prevTodos => [...prevTodos, response as Todo]);
      setNewTodos('');
      setTempTodo(null);
    } catch {
      setErrorMessage(ErrorType.Add);
      setIsAddingTodo(false);
    }
  };

  // To add a new task while pressing Enter:
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddTodo();
    }
  };

  // To delete the task
  const deleteTodo = async (id: number) => {
    try {
      await client.delete(`/todos/${id}`);

      const updateTodos = todos.filter(todo => todo.id !== id);

      setTodos(updateTodos);
    } catch {
      setErrorMessage(ErrorType.Delete);
    }
  };

  // Cleaning the completed tasks
  const clearForm = () => {
    const incompleteTodos = todos.filter(todo => !todo.completed);

    setTodos(incompleteTodos);
  };

  // change the status of the performance of individual tasks in the list
  const toggleCompleted = (id: number) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }

      return todo;
    });

    setTodos(updatedTodos);
  };

  // Switching the status of all tasks using Toggleall
  const toggleAllChange = () => {
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !toggleAll,
    }));

    setTodos(updatedTodos);
    setToggleAll(!toggleAll);
  };

  // Editing the task in the EditTodo function
  const editTodo: editTodoFunction = (id, newTitle) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, title: newTitle };
      }

      return todo;
    });

    setTodos(updatedTodos);
  };

  const todoState = {
    todos,
    setTodos,
    toggleAll,
    setToggleAll,
    filter,
    setFilter,
    filteredTodos,
    handleInputChange,
    handleKeyDown,
    handleAddTodo,
    deleteTodo,
    clearForm,
    toggleCompleted,
    toggleAllChange,
    editTodo,
    newTodos,
    setNewTodos,
    errorMessage,
    setErrorMessage,
    notification,
    setNotification,
    closeNotification,
    USER_ID,
    isAddingTodo,
    setIsAddingTodo,
    tempTodo,
    setTempTodo,
  };

  return (
    <TodosContext.Provider value={todoState}>{children}</TodosContext.Provider>
  );
};
