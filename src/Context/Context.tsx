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
  handleSubmit: (event:React.FormEvent) => void;
  tempTodo: Todo | null;
  isDisabled: boolean;
  handleDelite: (value: number) => void;
  multiplyDelite: (value: number[]) => void;
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
    handleSubmit: () => {},
    tempTodo: null,
    isDisabled: false,
    handleDelite: () => {},
    multiplyDelite: () => {},
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

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setTodoTitle(value);
    setErrorMessage('');
  };

  const createTodo = (title: string, userId: number) => {
    const temporaryValue = {
      title: todoTitle,
      userId: USER_ID,
      completed: false,
      id: 0,
    };

    setTempTodo(temporaryValue);
    setRenderedTodos(currentTodos => [...currentTodos, temporaryValue]);

    return addTodo({ title, completed: false, userId })
      .then(newTodo => {
        setRenderedTodos(
          currentRenderedTodos => currentRenderedTodos.map(todo => {
            if (todo.id === 0) {
              return newTodo;
            }

            return todo;
          }),
        );
      })
      .catch((error) => {
        setErrorMessage(Error.Load);
        setRenderedTodos(currentTodos => currentTodos
          .filter(todo => todo.id !== 0));
        throw error;
      });
  };

  const handleDelite = (todoId:number) => {
    const currentTodo = renderedTodos.find(todo => todo.id === todoId);

    if (currentTodo) {
      setTempTodo(currentTodo);
    }

    setRenderedTodos(currenTodos => currenTodos
      .filter(todo => todo.id !== todoId));

    return removeTodo(todoId)
      .catch(() => {
        setRenderedTodos(renderedTodos);
        setErrorMessage(Error.Remove);
      })
      .finally(() => {
        setErrorMessage('');
        setTempTodo(null);
      });
  };

  const multiplyDelite = (ids:number[]) => {
    setRenderedTodos(currentTodos => currentTodos
      .filter(({ completed }) => !completed));
    ids.forEach(id => removeTodo(id));
  };

  const handleSubmit = (event:React.FormEvent) => {
    event.preventDefault();
    const preaperedTitle = todoTitle.trim();

    if (!preaperedTitle) {
      setErrorMessage(Error.Title);

      return;
    }

    setIsDisabled(true);

    createTodo(todoTitle, USER_ID)
      .then(() => setTodoTitle(''))
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
    handleSubmit,
    tempTodo,
    isDisabled,
    handleDelite,
    multiplyDelite,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
