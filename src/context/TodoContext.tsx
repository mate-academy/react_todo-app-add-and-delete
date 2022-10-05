import {
  ChangeEvent,
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useState,
} from 'react';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';
import { TypeChange } from '../types/TypeChange';

interface Context {
  filtredTodos: Todo[],
  setFiltredTodos: (value: Todo[]) => void,
  inputValue: string,
  setInputValue: (value: string) => void,
  handleStatusChange: (todo: Todo, type: TypeChange) => void,
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  selectedTodoId: number | null,
  setSelectedTodoId: (value: number | null) => void,
  handleFilter: (filterStatus: number, data: Todo[]) => void,
  filterState: Filter,
  setFilterState: (value: Filter) => void,
  handleChangeTitle: (event: ChangeEvent<HTMLInputElement>) => void,
  loadError: boolean,
  setLoadError: (value: boolean) => void,
  errorMessage: string,
  setErrorMessage: (value: string) => void,
  allCompletedLoader: boolean,
  setAllCompletedLoader: (value: boolean) => void,
  todoIdLoader: number | null,
  setTodoIdLoader: (value: number | null) => void,
  toggleLoader: boolean,
  setToggleLoader: (value: boolean) => void,
}

export const TodoContext = createContext<Context>({
  filtredTodos: [],
  setFiltredTodos: () => undefined,
  inputValue: '',
  setInputValue: () => undefined,
  handleStatusChange: () => undefined,
  todos: [],
  setTodos: () => undefined,
  selectedTodoId: null,
  setSelectedTodoId: () => undefined,
  handleFilter: () => undefined,
  filterState: Filter.all,
  setFilterState: () => undefined,
  handleChangeTitle: () => undefined,
  loadError: false,
  setLoadError: () => undefined,
  errorMessage: '',
  setErrorMessage: () => undefined,
  allCompletedLoader: false,
  setAllCompletedLoader: () => undefined,
  todoIdLoader: null,
  setTodoIdLoader: () => undefined,
  toggleLoader: false,
  setToggleLoader: () => undefined,
});

export function TodoProvider({ children }: { children?: ReactNode }) {
  const [filtredTodos, setFiltredTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [filterState, setFilterState] = useState(Filter.all);
  const [loadError, setLoadError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [allCompletedLoader, setAllCompletedLoader] = useState(false);
  const [todoIdLoader, setTodoIdLoader] = useState<null | number>(null);
  const [toggleLoader, setToggleLoader] = useState(false);

  const handleFilter = useCallback((filterStatus: number, data: Todo[]) => {
    setFilterState(filterStatus);
    const copyOfTodos = data.filter(todo => {
      switch (filterStatus) {
        case Filter.active:
          return !todo.completed;
        case Filter.completed:
          return todo.completed;
        default:
          return todo;
      }
    });

    setFiltredTodos(copyOfTodos);
  }, [filterState, todos]);

  const handleStatusChange = (todo: Todo, type: TypeChange) => {
    const found = todos.find(stateTodo => stateTodo.id === todo.id) as Todo;

    const foundIndex = todos.findIndex(stateTodo => stateTodo.id === todo.id);

    if (type !== TypeChange.delete && type !== TypeChange.deleteAll) {
      switch (type) {
        case TypeChange.checkbox:
          found.completed = !found.completed;
          break;
        case TypeChange.title:
          setSelectedTodoId(null);
          found.title = inputValue;
          break;
        default:
          throw new Error('Error type one');
      }
    }

    setTodos((oldState) => {
      let newTodos = oldState;

      switch (type) {
        case TypeChange.checkbox:
        case TypeChange.title:
          newTodos = todos.map((item, index) => {
            if (index === foundIndex) {
              return found;
            }

            return item;
          });
          break;
        case TypeChange.delete:
          newTodos = todos.filter(item => item.id !== todo.id);
          break;
        case TypeChange.deleteAll:
          newTodos = todos.filter(item => !item.completed);
          break;
        default:
          throw new Error('Error type two');
      }

      handleFilter(filterState, newTodos);

      return newTodos;
    });
  };

  const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <TodoContext.Provider value={{
      filtredTodos,
      setFiltredTodos,
      inputValue,
      setInputValue,
      handleStatusChange,
      todos,
      setTodos,
      selectedTodoId,
      setSelectedTodoId,
      handleFilter,
      filterState,
      setFilterState,
      handleChangeTitle,
      errorMessage,
      loadError,
      setErrorMessage,
      setLoadError,
      allCompletedLoader,
      setAllCompletedLoader,
      todoIdLoader,
      setTodoIdLoader,
      setToggleLoader,
      toggleLoader,
    }}
    >
      {children}
    </TodoContext.Provider>
  );
}
