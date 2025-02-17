import React, {
  createRef,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Todo } from '../types/Todo';
import * as postService from '../api/todos';

enum FilerType {
  FILTER_TODO_ALL = 'all',
  FILTER_TODO_ACTIVE = 'active',
  FILTER_TODO_COMPLETED = 'completed',
}

type TodosContextType = {
  todos: Todo[];
  setTodos: (v: Todo[]) => void;
  toggleAll: () => void;
  addTodo: (newTodo: Todo) => Promise<void>;
  isAllTodoCompleted: boolean;
  updateTodo: (newTodo: Todo) => void;
  deleteTodo: (deletedTodo: Todo) => void;
  clearCompleted: () => void;
  filterField: FilerType;
  setFilterField: React.Dispatch<React.SetStateAction<FilerType>>;
  visibleTodos: Todo[];
  ref: React.RefObject<HTMLInputElement>;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  stateClearBtn: boolean;
  setStateClearBtn: React.Dispatch<React.SetStateAction<boolean>>;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  tempTodo: Todo | null;
  loaderTodo: Todo | null;
};

export const TodosContext = React.createContext<TodosContextType>({
  todos: [],
  setTodos: () => {},
  toggleAll: () => {},
  addTodo: async () => {},
  isAllTodoCompleted: false,
  updateTodo: () => {},
  deleteTodo: () => {},
  clearCompleted: () => {},
  filterField: FilerType.FILTER_TODO_ALL,
  setFilterField: () => {},
  visibleTodos: [],
  ref: createRef(),
  errorMessage: '',
  setErrorMessage: () => {},
  stateClearBtn: false,
  setStateClearBtn: () => {},
  isSubmitting: false,
  setIsSubmitting: () => {},
  tempTodo: null,
  loaderTodo: null,
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterField, setFilterField] = useState(FilerType.FILTER_TODO_ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [stateClearBtn, setStateClearBtn] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loaderTodo, setLoaderTodo] = useState<Todo | null>(null);

  const ref = useRef<HTMLInputElement>(null);

  const addTodo = useCallback(({ title, completed, userId }: Todo) => {
    setErrorMessage('');

    if (title.trim() !== '') {
      setTempTodo({ id: 0, title, completed, userId });
    }

    return postService
      .createTodos({ title, completed, userId })
      .then(newTodo => {
        setTodos(curentTodos => [...curentTodos, newTodo]);
      })
      .catch(error => {
        setErrorMessage('Unable to add a todo');
        setTimeout(() => setErrorMessage(''), 3000);
        throw error;
      })
      .finally(() => setTempTodo(null));
  }, []);

  const updateTodo = useCallback((updatedTodo: Todo) => {
    setErrorMessage('');

    return postService
      .updateTodo(updatedTodo)
      .then(newTodo => {
        setTodos(curentTodos => {
          const newTodos = [...curentTodos];
          const index = newTodos.findIndex(todo => todo.id === updatedTodo.id);

          newTodos.splice(index, 1, newTodo);

          return newTodos;
        });
      })
      .catch(error => {
        setErrorMessage('Unable to update a todo');
        setTimeout(() => setErrorMessage(''), 3000);
        throw error;
      });
  }, []);

  const deleteTodo = useCallback(
    (deletedTodo: Todo) => {
      const newTodos = todos.filter(todo => todo.id !== deletedTodo.id);

      setTodos(newTodos);

      return postService
        .deleteTodo(deletedTodo.id)
        .finally(() => setIsSubmitting(false))
        .catch(error => {
          setTodos(todos);
          setErrorMessage('Unable to delete a todo');
          setTimeout(() => setErrorMessage(''), 3000);
          throw error;
        });
    },
    [todos],
  );

  const clearCompleted = useCallback(() => {
    const noDeleteTodos = todos.filter(todo => todo.completed === false);
    const deleteTodos = todos.filter(todo => todo.completed === true);

    return deleteTodos.forEach(todo => {
      setLoaderTodo(todo);
      postService
        .deleteTodo(todo.id)
        .then(() => setTodos(noDeleteTodos))
        .finally(() => {
          setIsSubmitting(false);
          setLoaderTodo(null);
        })
        .catch(() => {
          setTodos(todos);
          setErrorMessage('Unable to delete a todo');
          setTimeout(() => setErrorMessage(''), 3000);
        });
    });
  }, [todos]);

  const toggleAll = useCallback(() => {
    const newTodos = [...todos];

    const result = newTodos.every(todo => todo.completed);

    if (result) {
      const changeTodos = newTodos.map(todo => {
        return { ...todo, completed: !todo.completed };
      });

      setTodos(changeTodos);
    } else {
      const changeTodos = newTodos.map(todo => {
        if (todo.completed === false) {
          return { ...todo, completed: !todo.completed };
        } else {
          return todo;
        }
      });

      setTodos(changeTodos);
    }
  }, [setTodos, todos]);

  const isAllTodoCompleted = todos.every(todo => todo.completed);

  function getPrepareTodos(filter: FilerType, todos1: Todo[]) {
    const prepearedTodos = [...todos1];

    if (filter) {
      const result = prepearedTodos.filter(todo => {
        switch (filter) {
          case FilerType.FILTER_TODO_ALL:
            return todo;
          case FilerType.FILTER_TODO_ACTIVE:
            return todo.completed !== true;
          case FilerType.FILTER_TODO_COMPLETED:
            return todo.completed === true;
          default:
            return todo;
        }
      });

      return result;
    } else {
      return todos;
    }
  }

  const visibleTodos = getPrepareTodos(filterField, todos);

  const value = useMemo(
    () => ({
      todos,
      setTodos,
      toggleAll,
      addTodo,
      isAllTodoCompleted,
      updateTodo,
      deleteTodo,
      clearCompleted,
      filterField,
      setFilterField,
      visibleTodos,
      ref,
      errorMessage,
      setErrorMessage,
      stateClearBtn,
      setStateClearBtn,
      isSubmitting,
      setIsSubmitting,
      // errorDalay,
      tempTodo,
      loaderTodo,
    }),
    [
      addTodo,
      clearCompleted,
      deleteTodo,
      filterField,
      isAllTodoCompleted,
      setTodos,
      todos,
      toggleAll,
      updateTodo,
      visibleTodos,
      ref,
      errorMessage,
      setErrorMessage,
      stateClearBtn,
      setStateClearBtn,
      isSubmitting,
      setIsSubmitting,
      // errorDalay,
      tempTodo,
      loaderTodo,
    ],
  );

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};
