import { createContext, useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { deleteTodo, getTodos } from '../api/todos';

type Props = {
  children: React.ReactNode;
};

type ContextType = {
  isSelected: Todo | null;
  setIsSelected: (v: Todo | null) => void;
  handleDelete: (id: number) => void;
  isLoadingToDelete: boolean;
  setIsLoadingToDelete: (v: boolean) => void;
  handleComplete: (todoId: number, status: boolean) => void;
  handleClearCompleted: () => void;
  fucused: Date;
  setFocused: (v: Date) => void;
  filterTodos: (list: Todo[], filterBy: string) => Todo[];
  isDisabled: boolean;
  setIdDisabled: (v: boolean) => void;
  isCompleted: boolean;
  setIsCompleted: (v: boolean) => void;
  tempTodo: Todo | null;
  setTempTodo: (v: Todo | null) => void;
  todos: Todo[];
  setTodos: (value: React.SetStateAction<Todo[]>) => void;
  errorMessage: string;
  setErrorMessage: (v: string) => void;
};

export const TodosContext = createContext<ContextType>({
  isSelected: null,
  setIsSelected: () => {},
  handleDelete: () => {},
  isLoadingToDelete: false,
  setIsLoadingToDelete: () => {},
  handleComplete: () => [],
  handleClearCompleted: () => {},
  fucused: new Date(),
  setFocused: () => {},
  filterTodos: () => [],
  isDisabled: false,
  setIdDisabled: () => {},
  isCompleted: false,
  setIsCompleted: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  todos: [],
  setTodos: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
});

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isDisabled, setIdDisabled] = useState(false);
  const [fucused, setFocused] = useState(new Date());
  const [isLoadingToDelete, setIsLoadingToDelete] = useState(false);
  const [isSelected, setIsSelected] = useState<Todo | null>(null);

  useEffect(() => {
    setErrorMessage('');
    getTodos()
      .then(setTodos)
      .catch(error => {
        setErrorMessage('Unable to load todos');
        throw error;
      });

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, []);

  function filterTodos(list: Todo[], filterBy: string) {
    switch (filterBy) {
      case '#/':
        return list;
      case '#/active':
        return list.filter(todo => !todo.completed);
      case '#/completed':
        return list.filter(todo => todo.completed);
      default:
        return list;
    }
  }

  const handleClearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id)
          .then(() =>
            setTodos(prevTodo => {
              const copyTodo = [...prevTodo];

              const index = copyTodo.findIndex(fTodo => fTodo.id === todo.id);

              copyTodo.splice(index, 1);

              return [...copyTodo];
            }),
          )
          .catch(error => {
            setErrorMessage('Unable to delete a todo');
            setTodos(todos);

            throw error;
          })
          .finally(() => setFocused(new Date()));
      }
    });
  };

  const handleComplete = (todoId: number, status: boolean) => {
    setIsCompleted(!status);

    setTodos(prevTodo => {
      const newTodo = [...prevTodo];

      return newTodo.map(todo => {
        if (todo.id === todoId) {
          return {
            ...todo,
            completed: status,
          };
        }

        return todo;
      });
    });
  };

  const handleDelete = (todoId: number) => {
    setIsLoadingToDelete(true);

    return deleteTodo(todoId)
      .then(() => {})
      .catch(error => {
        setErrorMessage('Unable to delete a todo');
        setTodos(todos);
        throw error;
      })
      .finally(() => {
        setTodos(currentTodos => {
          let copyCurrentTodos = [...currentTodos];

          copyCurrentTodos = copyCurrentTodos.filter(
            todo => todo.id !== todoId,
          );

          return [...copyCurrentTodos];
        });
        setFocused(new Date());
        setIsLoadingToDelete(false);
      });
  };

  const todosTools = {
    isSelected,
    setIsSelected,
    handleDelete,
    isLoadingToDelete,
    setIsLoadingToDelete,
    handleComplete,
    handleClearCompleted,
    fucused,
    setFocused,
    filterTodos,
    isCompleted,
    setIsCompleted,
    tempTodo,
    setTempTodo,
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    isDisabled,
    setIdDisabled,
  };

  return (
    <TodosContext.Provider value={todosTools}>{children}</TodosContext.Provider>
  );
};
