import React, {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useRef,
} from 'react';
import * as api from './api/todos';
import { Todo } from './types/Todo';

interface TodoContextProps {
  children: ReactNode;
}

interface TodoContextValue {
  todos: Todo[];
  postTodo: string;
  filteredTodos: Todo[];
  filter: string;
  error: string;
  existingCompleted: boolean;
  nonCompletedTodos: number;
  disableInput: boolean
  isLoading: number[];
  titleField: React.MutableRefObject<HTMLInputElement>;
  tempTodo: Todo | null;
  isChosenToRename: number;
  editingTodo: string;
  setEditingTodo: (qury: string) => void;
  setIsLoading: (id: number[]) => void;
  setError: (errorMessage: string) => void;
  setFilter: (newFilter: string) => void;
  handleSubmit: () => void;
  setPostTodo: (postTodo: string) => void;
  setFilteredTodos: (todos: Todo[]) => void;
  setDisableInput: (bollean: boolean) => void;
  handleDelete: (id: number) => void;
  handleCompletedDelete: () => void,
  makeTodoCompleted: (id: number, isCompleted: boolean) => void,
  setIsChosenToRename: (id: number) => void,
  handleEditing: (id: number) => void,
  makeTodoChange: (id: number, value: string) => void,
}

export const TodoContext = createContext<TodoContextValue>({
  todos: [],
  postTodo: '',
  filteredTodos: [],
  filter: '',
  error: '',
  existingCompleted: false,
  nonCompletedTodos: 0,
  disableInput: false,
  isLoading: [],
  tempTodo: null,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  titleField: null!,
  isChosenToRename: 0,
  editingTodo: '',
  setEditingTodo: () => {},
  setIsLoading: () => { },
  setError: () => { },
  setFilter: () => { },
  handleSubmit: () => { },
  setPostTodo: () => { },
  setFilteredTodos: () => { },
  setDisableInput: () => { },
  handleDelete: () => { },
  handleCompletedDelete: () => { },
  makeTodoCompleted: () => {},
  setIsChosenToRename: () => {},
  handleEditing: () => {},
  makeTodoChange: () => {},
});

const USER_ID = 104;

export const TodoProvider: React.FC<TodoContextProps> = ({ children }) => {
  const [postTodo, setPostTodo] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [disableInput, setDisableInput] = useState(false);
  const [isLoading, setIsLoading] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [doubleClickCounter, setDoubleClickCounter] = useState(1);
  const [isChosenToRename, setIsChosenToRename] = useState(0);
  const [editingTodo, setEditingTodo] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const titleField = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [todos, error]);

  const existingCompleted = todos.some((todo) => {
    return todo.completed;
  });

  const nonCompletedTodos = todos.reduce((counter, todo) => {
    if (!todo.completed) {
      return counter + 1;
    }

    return counter;
  }, 0);

  const loadTodos = () => {
    api.getTodos(USER_ID)
      .then((apiTodos) => {
        setTodos(apiTodos);
        setFilteredTodos(apiTodos);
      })
      .catch(() => {
        setError('Unable to load todos');
      });
  };

  useEffect(() => {
    loadTodos();
  }, [isLoading]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [error]);

  useEffect(() => {
    const filtereDtodo = () => {
      switch (filter) {
        case 'active':
          return todos.filter((todo) => {
            return todo.completed === false;
          });
        case 'completed':
          return todos.filter((todo) => {
            return todo.completed === true;
          });
        case 'all':
          return todos;
        default:
          return todos;
      }
    };

    setFilteredTodos(filtereDtodo());
  }, [filter, todos]);

  const handleSubmit = () => {
    if (!postTodo.trim()) {
      setDisableInput(false);

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: postTodo.trim(),
      completed: false,
    };

    setTempTodo(newTodo);

    api.postTodos(newTodo)
      .then((todo) => {
        setTodos((currentTodos) => [...currentTodos, todo]);
        setTempTodo(null);
        setPostTodo('');
      })
      .catch(() => {
        setError('Unable to add a todo');
        setTempTodo(null);
        if (titleField.current) {
          titleField.current.focus();
        }
      })
      .finally(() => {
        setDisableInput(false);
      });
  };

  const handleEditing = (id: number) => {
    setDoubleClickCounter(currentCount => {
      return currentCount + 1;
    });

    if (doubleClickCounter === 2) {
      setIsChosenToRename(id);
    }

    setTimeout(() => {
      setDoubleClickCounter(1);
    }, 300);
  };

  const handleDelete = (id: number) => {
    setIsLoading((currentLoading) => [...currentLoading, id]);

    api.deletTodos(id)
      .then(() => {
        setFilteredTodos((currentFilteredTodos) => currentFilteredTodos.filter(
          (todo) => todo.id !== id,
        ));
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setIsLoading((currentLoading) => {
          return currentLoading.filter((loadingId) => loadingId !== id);
        });
      });
  };

  const makeTodoChange = (id: number, value: string) => {
    const changedTodo: Pick<Todo, 'title' | 'userId'>
    = { title: value, userId: USER_ID };

    api.patchTodos(id, changedTodo)
      .then(() => {
        loadTodos();
      });
  };

  const makeTodoCompleted = (id: number, isCompleted: boolean) => {
    const completedTodo: Pick<Todo, 'completed' | 'userId'>
    = { completed: !isCompleted, userId: USER_ID };

    api.patchTodos(id, completedTodo)
      .then(() => {
        loadTodos();
      });
  };

  const handleCompletedDelete = () => {
    const completedTodoIds = todos.filter((todo) => todo.completed)
      .map((todo) => todo.id);

    if (completedTodoIds.length > 0) {
      completedTodoIds.forEach((id) => {
        setIsLoading((currentLoading) => [...currentLoading, id]);

        api.deletTodos(id)
          .then(() => {
            setTodos((currentTodos) => {
              return currentTodos.filter((todo) => todo.id !== id);
            });
          })
          .catch(() => {
            setError('Unable to delete a todo');
          })
          .finally(() => {
            setIsLoading((currentLoading) => {
              return currentLoading.filter((loadingId) => loadingId !== id);
            });
          });
      });
    }
  };

  const value = {
    postTodo,
    todos,
    filteredTodos,
    filter,
    error,
    existingCompleted,
    nonCompletedTodos,
    disableInput,
    isLoading,
    titleField,
    tempTodo,
    isChosenToRename,
    editingTodo,
    setIsLoading,
    setFilter,
    handleSubmit,
    setError,
    setPostTodo,
    setFilteredTodos,
    setDisableInput,
    handleDelete,
    handleCompletedDelete,
    makeTodoCompleted,
    setIsChosenToRename,
    handleEditing,
    setEditingTodo,
    makeTodoChange,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
