import {
  FC,
  useState,
  useEffect,
  ReactNode,
  useContext,
  useCallback,
  createContext,
} from 'react';
import { getPendingTodosByUser } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type FilterTypes = 'all' | 'active' | 'completed';

type ContextProps = {
  todos: Todo[];
  errors: string[];
  setTodos: (cb: (tds: Todo[]) => Todo[]) => void;
  setErrors: (ers: string[] | ((prv: string[]) => string[])) => void;
  filterType: FilterTypes;
  setFilterType: (fT: FilterTypes) => void;
  pendingTodos: number[];
  setPendingTodos: (tdsOrCb: number[] | ((tds: number[]) => number[])) => void;
};

export const TodosContext = createContext<ContextProps>({
  todos: [],
  setTodos: () => {},
  errors: [],
  setErrors: () => {},
  filterType: 'all',
  setFilterType: () => '',
  pendingTodos: [],
  setPendingTodos: () => {},
});

type Props = {
  children: ReactNode;
};

export const TodosProvider: FC<Props> = ({ children }) => {
  const [loading, setLoading] = useState(true);

  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<FilterTypes>('all');
  const [pendingTodos, setPendingTodos] = useState<number[]>([]);

  useEffect(() => {
    if (user) {
      getPendingTodosByUser(user.id)
        .then(result => {
          setTodos(result);
          setLoading(false);
        });
    }
  }, []);

  const setTodosCB = useCallback((cb: (tds: Todo[]) => Todo[]) => {
    setTodos(prev => cb(prev));
  }, [setTodos]);

  const setErrorsCB = useCallback(
    (ersOrCallback: string[] | ((prv: string[]) => string[])) => {
      if (Array.isArray(ersOrCallback)) {
        setErrors(ersOrCallback);
      } else {
        setErrors(prev => ersOrCallback(prev));
      }
    }, [setErrors],
  );

  const setFilterTypeCB = useCallback((fT: FilterTypes) => {
    setFilterType(fT);
  }, [setFilterType]);

  const setPendingTodosCB = useCallback(
    (tdsOrCB: number[] | ((prv: number[]) => number[])) => {
      if (Array.isArray(tdsOrCB)) {
        setPendingTodos(tdsOrCB);
      } else {
        setPendingTodos(prev => tdsOrCB(prev));
      }
    }, [setPendingTodos],
  );

  if (loading) {
    return null;
  }

  return (
    <TodosContext.Provider value={{
      todos,
      setTodos: setTodosCB,
      errors,
      setErrors: setErrorsCB,
      filterType,
      setFilterType: setFilterTypeCB,
      pendingTodos,
      setPendingTodos: setPendingTodosCB,
    }}
    >
      {children}
    </TodosContext.Provider>
  );
};
