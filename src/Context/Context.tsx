import {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Error, States, Todo } from '../types/Todo';
import { addTodo, getTodos, removeTodo } from '../api/todos';
import { getFilteredTodos } from '../helpers';

interface TodoContextType {
  renderedTodos: Todo[];
  setRenderedTodos: (value: Todo[]) => void;
  filteredList: Todo[];
  selectedOption: string;
  setSelectedOption: (value: string) => void;
  errorMessage: string;
  setErrorMessage: (value: string) => void;
  handleInput:(value:React.ChangeEvent<HTMLInputElement>) => void;
  todoTitle: string;
  handleSubmitForm: (event:React.FormEvent) => void;
  tempTodo: Todo | null;
  isDisabled: boolean;
  handleDelite: (value: number) => void;
  multiplyDelite: () => void;
  todosForDelete: number[];
  onDelete: number[];
}

const TodoContext = createContext<TodoContextType>(
  {
    renderedTodos: [],
    setRenderedTodos: () => {},
    filteredList: [],
    selectedOption: '',
    setSelectedOption: () => {},
    errorMessage: '',
    setErrorMessage: () => {},
    handleInput: () => {},
    todoTitle: '',
    handleSubmitForm: () => {},
    tempTodo: null,
    isDisabled: false,
    handleDelite: () => {},
    multiplyDelite: () => {},
    todosForDelete: [],
    onDelete: [],
  },
);

export const useTodoContext = () => useContext(TodoContext);

type Props = {
  children: React.ReactNode
};

const USER_ID = 12023;

export const TodoContextProvider: FC<Props> = ({ children }) => {
  const [renderedTodos, setRenderedTodos] = useState<Todo[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>(States.All);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [onDelete, setOnDelete] = useState<number[]>([]);

  const todosForDelete = renderedTodos.filter(({ completed }) => completed)
    .map(todo => todo.id);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setTodoTitle(value);
  };

  const createTodo = (title: string, userId: number) => {
    const temporaryValue = {
      title: todoTitle,
      userId: USER_ID,
      completed: false,
      id: 0,
    };

    setTempTodo(temporaryValue);

    return addTodo({ title, completed: false, userId })
      .then(newTodo => {
        setRenderedTodos(currentRenderedTodos => [...currentRenderedTodos,
          newTodo]);
      })
      .catch((error) => {
        setErrorMessage(Error.Load);
        throw error;
      });
  };

  const handleDelite = (todoId:number) => {
    setOnDelete(curentTodoIds => [...curentTodoIds, todoId]);
    setTimeout(() => {
      setRenderedTodos(currenTodos => currenTodos
        .filter(todo => todo.id !== todoId));
    }, 500);

    removeTodo(todoId)
      .catch(() => {
        setRenderedTodos(renderedTodos);
        setErrorMessage(Error.Remove);
      })
      .finally(() => {
        setOnDelete([]);
      });
  };

  const multiplyDelite = () => {
    setOnDelete(todosForDelete);
    setTimeout(() => {
      setRenderedTodos(currentTodos => currentTodos
        .filter(({ completed }) => !completed));
    }, 500);
    todosForDelete.forEach(id => handleDelite(id));
  };

  const handleSubmitForm = (event:React.FormEvent) => {
    setErrorMessage('');
    event.preventDefault();
    const preaperedTitle = todoTitle.trim();

    if (!preaperedTitle) {
      setErrorMessage(Error.Title);

      return;
    }

    setIsDisabled(true);

    createTodo(todoTitle.trim(), USER_ID)
      .then(() => setTodoTitle(''))
      .catch(() => setErrorMessage(Error.Load))
      .finally(() => {
        setIsDisabled(false);
        setTempTodo(null);
      });
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setRenderedTodos)
      .catch(() => setErrorMessage(Error.Load));
  }, []);

  const filteredList = getFilteredTodos(renderedTodos, selectedOption);

  const value: TodoContextType = {
    renderedTodos,
    setRenderedTodos,
    filteredList,
    selectedOption,
    setSelectedOption,
    errorMessage,
    setErrorMessage,
    handleInput,
    todoTitle,
    handleSubmitForm,
    tempTodo,
    isDisabled,
    handleDelite,
    multiplyDelite,
    todosForDelete,
    onDelete,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
