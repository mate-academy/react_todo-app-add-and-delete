import { createContext, useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { deleteTodo, getTodos } from '../api/todos';
import { Filter } from '../enum/Filter';

type Props = {
  children: React.ReactNode;
};

type ContextType = {
  loadingIds: number[];
  setLoadingIds: (v: number[]) => void;
  isSelected: Todo | null;
  setIsSelected: (v: Todo | null) => void;
  handleDelete: (id: number) => void;
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
  loadingIds: [],
  setLoadingIds: () => [],
  isSelected: null,
  setIsSelected: () => {},
  handleDelete: () => {},
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
  const [focused, setFocused] = useState(new Date());
  const [isSelected, setIsSelected] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  useEffect(() => {
    setErrorMessage('');
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        // throw error; // чому тут не потрібно прокидувати помилку throw error
      });

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, []);

  const handleDelete = (todoId: number) => {
    setLoadingIds([...loadingIds, todoId]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(item => item !== todoId));
        setFocused(new Date());
      });
  };

  function filterTodos(list: Todo[], filterBy: string) {
    switch (filterBy) {
      case Filter.all:
        return list;
      case Filter.active:
        return list.filter(todo => !todo.completed);
      case Filter.completed:
        return list.filter(todo => todo.completed);
      default:
        return list;
    }
  }

  const handleClearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDelete(todo.id);
        // deleteTodo(todo.id)
        //   .then(() =>
        //     setTodos(prevTodo => {
        //       const copyTodo = [...prevTodo];

        //       const index = copyTodo.findIndex(fTodo => fTodo.id === todo.id);

        //       copyTodo.splice(index, 1);

        //       return [...copyTodo];
        //     }),
        //   )
        //   .catch(error => {
        //     setErrorMessage('Unable to delete a todo');
        //     // setTodos(todos);

        //     throw error;
        //   })
        //   .finally(() => setFocused(new Date()));
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

  const todosTools = {
    loadingIds,
    setLoadingIds,
    isSelected,
    setIsSelected,
    handleDelete,
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
