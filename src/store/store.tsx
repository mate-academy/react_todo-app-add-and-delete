import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { Dispatchers } from '../types/enums/Dispatchers';
import { getTodos, addTodo, deleteTodo } from '../api/todos';
import { Errors } from '../types/enums/Errors';

const USER_ID = 11806;

type Actions =
  { type: Dispatchers.Add;
    payload: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: Dispatchers.UpdateTitle; payload: Todo }
  | { type: Dispatchers.ChangeStatus; payload: number }
  | { type: Dispatchers.ChangeAllStatuses; payload: boolean }
  | { type: Dispatchers.DeleteWithId; payload: number }
  | { type: Dispatchers.DeleteComplited }
  | { type: Dispatchers.Load };

interface TodosState {
  todos: Todo[];
  dispatcher: (act: Actions) => void;
  errorType: Errors | null;
  tempTodo: Todo | null;
  activeTodoIds: number[];
  clearErrorMessage: () => void;
}

interface FormState {
  formValue: string;
  onSetFormValue: (val: string) => void;
  disabledInput: boolean;
  inputRef: null | React.LegacyRef<HTMLInputElement>
}

const initialTodosState: TodosState = {
  todos: [],
  dispatcher: () => { },
  errorType: null,
  tempTodo: null,
  activeTodoIds: [],
  clearErrorMessage: () => { },
};

const initialFormState: FormState = {
  formValue: '',
  onSetFormValue: () => [],
  disabledInput: false,
  inputRef: null,
};

export const TodosContext = React.createContext(initialTodosState);
export const FormControlContext = React.createContext(initialFormState);

type Props = {
  children: React.ReactNode,
};

const localInitial: Todo[] = [];

export const GlobalProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>(localInitial);
  const [errorType, setErrorType] = useState<Errors | null>(null);

  const [formValue, setFormValue] = useState('');
  const [disabledInput, setDisabled] = useState(false);

  const [activeTodoIds, setActiveTodoIds] = useState<number[]>([]);

  const [errorTimeaut, setErrorTimeaut] = useState<NodeJS.Timeout | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [
    tempTodo,
    setTempTodo,
  ] = useState<Todo | null>(null);

  const newErrorTimeout = (errorName: Errors) => {
    setErrorType(errorName);
    const timeout = setTimeout(() => {
      setErrorType(null);
    }, 3000);

    setErrorTimeaut(timeout);
  };

  const clearErrorMessage = () => {
    if (errorTimeaut) {
      clearTimeout(errorTimeaut);
      setErrorType(null);
    }
  };

  const onSetFormValue = (val: string) => {
    setFormValue(val);
  };

  const reducer = async (state: Todo[], action: Actions) => {
    switch (action.type) {
      case Dispatchers.Load:
        try {
          const todosFromServer = await getTodos(USER_ID);

          setTodos(todosFromServer);
        } catch (error) {
          newErrorTimeout(Errors.GET);
        }

        break;

      case Dispatchers.Add: {
        const createdTodo = action.payload;

        if (!createdTodo.title) {
          newErrorTimeout(Errors.EMPTY);

          return;
        }

        setDisabled(true);

        setTempTodo({
          ...createdTodo,
          id: 0,
          updatedAt: '',
          createdAt: '',
        });

        try {
          const newTodo = await addTodo(action.payload);

          setTodos([
            ...state,
            newTodo,
          ]);
          setTempTodo(null);
          setFormValue('');
        } catch (error) {
          // setErrorType(Errors.POST);
          setTempTodo(null);
          newErrorTimeout(Errors.POST);
        } finally {
          setDisabled(false);
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }, 0);
        }
      }

        break;

      case Dispatchers.DeleteComplited: {
        const todosIds = [...state]
          .filter(todo => todo.completed)
          .map(todo => todo.id);

        setActiveTodoIds(prev => [...prev, ...todosIds]);

        try {
          await Promise
            .all(todosIds.map(id => deleteTodo(id)));

          setTodos(prev => [...prev].filter(todo => !todo.completed));

          // console.log(resJson)
        } catch (err) {
          newErrorTimeout(Errors.DELETE);
        } finally {
          setActiveTodoIds([]);
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }
        // setTodos([...state].filter(todo => !todo.completed));
      }

        break;

      case Dispatchers.DeleteWithId:
        setActiveTodoIds(prev => [...prev, action.payload]);

        try {
          await deleteTodo(action.payload);

          setTodos([...state].filter(todo => todo.id !== action.payload));
        } catch (error) {
          // setErrorType(Errors.DELETE);
          newErrorTimeout(Errors.DELETE);
        } finally {
          setActiveTodoIds(
            prev => [...prev].filter(id => id !== action.payload),
          );
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }

        break;

      case Dispatchers.ChangeStatus: {
        const updatedStatusTodo = [...state].map(todo => {
          if (todo.id === action.payload) {
            return {
              ...todo,
              completed: !todo.completed,
            };
          }

          return todo;
        });

        setTodos(updatedStatusTodo);
      }

        break;

      case Dispatchers.UpdateTitle: {
        const { title, id } = action.payload;

        const updatedTitleTodo = [...state].map(todo => {
          if (todo.id === id) {
            return {
              ...todo,
              title,
            };
          }

          return todo;
        });

        setTodos(updatedTitleTodo);
      }

        break;

      case Dispatchers.ChangeAllStatuses:
        setTodos([...state].map(todo => {
          return {
            ...todo,
            completed: action.payload,
          };
        }));
        break;

      default:
        break;
    }
  };

  const dispatcher = (action: Actions) => {
    return reducer(todos, action);
  };

  useEffect(() => {
    reducer(todos, { type: Dispatchers.Load });
    if (inputRef.current) {
      inputRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TodosContext.Provider
      value={{
        todos,
        dispatcher,
        errorType,
        tempTodo,
        activeTodoIds,
        clearErrorMessage,
      }}
    >
      <FormControlContext.Provider value={{
        formValue,
        onSetFormValue,
        disabledInput,
        inputRef,
      }}
      >
        {children}
      </FormControlContext.Provider>
    </TodosContext.Provider>
  );
};
