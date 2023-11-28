import
React,
{
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { ErrorType } from './types/ErrorType';
import { FilterType } from './types/FilterType';

const initialTodos: Todo[] = [];
const userId = 11973;

type TodosContextType = {
  userId: number;
  todos: Todo[];
  filter: FilterType;
  errorMassage: ErrorType;
  tempTodo: Todo | null;
  isDeleting: boolean;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
  setErrorMassage: React.Dispatch<React.SetStateAction<ErrorType>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TodosContext = React.createContext<TodosContextType>({
  userId,
  todos: initialTodos,
  filter: FilterType.ALL,
  errorMassage: ErrorType.NO_ERROR,
  tempTodo: null,
  isDeleting: false,
  setTodos: () => { },
  setFilter: () => { },
  setErrorMassage: () => { },
  setTempTodo: () => { },
  setIsDeleting: () => { },
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FilterType.ALL);
  const [errorMassage, setErrorMassage] = useState(ErrorType.NO_ERROR);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function loadTodos() {
    getTodos(userId)
      .then(setTodos)
      .catch(() => setErrorMassage(ErrorType.LOAD_ERROR))
      .finally(() => {
        setTimeout(() => setErrorMassage(ErrorType.NO_ERROR), 3000);
      });
  }

  useEffect(loadTodos, []);

  const value = useMemo(() => ({
    userId,
    todos,
    setTodos,
    filter,
    setFilter,
    errorMassage,
    setErrorMassage,
    tempTodo,
    setTempTodo,
    isDeleting,
    setIsDeleting,
  }), [todos, filter, errorMassage, tempTodo, isDeleting]);

  // const value = {
  //   userId,
  //   todos,
  //   setTodos,
  //   visibleTodos,
  //   filter,
  //   setFilter,
  //   errorMassage,
  //   setErrorMassage,
  //   tempTodo,
  //   setTempTodo,
  //   isDeleting,
  //   setIsDeleting,
  // };

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
