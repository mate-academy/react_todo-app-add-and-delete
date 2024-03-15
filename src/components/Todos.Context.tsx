/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from 'react';
import { AddTodo, EditTodo, RemoveTodo, Status, Todo } from '../types/Todo';
import { deleteTodo, getTodos, postTodos } from '../api/todos';

export const TodosContext = createContext<TodosContextType>({
  todos: [],
  addTodo: () => {},
  removeTodo: () => {},
  editTodo: () => {},
  setTodos: () => {},
  status: Status.All,
  setStatus: () => {},
  filteredTodos: [],
  error: '',
  setError: () => '',
  submitting: false,
  setNewTodo: () => '',
  newTodo: '',
  setTempTodo: () => {},
  tempTodo: null,
});

type TodosContextType = {
  todos: Todo[];
  addTodo: AddTodo;
  removeTodo: RemoveTodo;
  editTodo: EditTodo;
  setTodos: (v: Todo[]) => void;
  status: Status;
  setStatus: (el: Status) => void;
  filteredTodos: Todo[];
  error: string;
  setError: Dispatch<SetStateAction<string>>;
  submitting: boolean;
  setNewTodo: Dispatch<SetStateAction<string>>;
  newTodo: string;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  tempTodo: Todo | null;
};

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(Status.All);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [newTodo, setNewTodo] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(err => {
        setError('Unable to load todos');
        setTimeout(() => {
          setError('');
        }, 3000);

        console.error('Error loading todos:', err);
      });
  }, []);

  const todoInput = document.getElementById('todoInput');

  const addTodo = ({ userId, title, completed }: Todo) => {
    setSubmitting(true);
    postTodos({ userId, title, completed })
      .then(newTo => {
        setTodos([...todos, newTo]);
        setNewTodo('');
        setSubmitting(false);
        setTempTodo(null);
      })
      .catch(err => {
        console.error('Unable to add a todo', err);
        setError('Unable to add a todo');
        setTimeout(() => {
          setError('');
          setTempTodo(null);
          todoInput?.focus();
        }, 3000);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const removeTodo = (id: number) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const todoInput = document.getElementById('todoInput');

    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(err => {
        console.error('Unable to delete a todo', err);
        setError('Unable to delete a todo');
        setTimeout(() => {
          setError('');
        }, 3000);
      })
      .finally(() => {
        todoInput?.focus();
      });
  };

  const editTodo = (id: number, newText: string) => {
    setTodos(
      todos.map(todo => {
        if (todo.id === id) {
          return { ...todo, title: newText };
        }

        return todo;
      }),
    );
  };

  const filterTodos = () => {
    switch (status) {
      case Status.Active:
        setFilteredTodos(todos.filter(todo => !todo.completed));
        break;

      case Status.Completed:
        setFilteredTodos(todos.filter(todo => todo.completed));
        break;

      default:
        setFilteredTodos(todos);
        break;
    }
  };

  useEffect(() => {
    filterTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, todos]);

  return (
    <TodosContext.Provider
      value={{
        todos,
        addTodo,
        removeTodo,
        editTodo,
        setTodos,
        status,
        setStatus,
        filteredTodos,
        error,
        setError,
        submitting,
        setNewTodo,
        newTodo,
        setTempTodo,
        tempTodo,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
