import React, { useRef, useState } from 'react';
import { Status } from './enums/status';
import { Todo } from './types/Todo';
import { deleteTodo, postTodo } from './api/todos';

type TodoContextProps = {
  todos: Todo[];
  tempTodo: Todo[] | null;
  visibleErr: boolean;
  stat: Status;
  errMessage: string;
  newTitle: string;
  isEdited: number | null;
  isLoading: number[];
  setIsLoading: React.Dispatch<React.SetStateAction<number[]>>;
  setIsEdited: React.Dispatch<React.SetStateAction<number | null>>;
  setNewTitle: React.Dispatch<React.SetStateAction<string>>;
  setErrMessage: React.Dispatch<React.SetStateAction<string>>;
  setStat: React.Dispatch<React.SetStateAction<Status>>;
  setVisibleErr: React.Dispatch<React.SetStateAction<boolean>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo[] | null>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  addTodo: () => Promise<void>;
  removeTodo: (todoToRmove: Todo) => Promise<void>;
  handleSubmit: (event: React.FormEvent) => void;
  resetErr: () => NodeJS.Timeout;
  editSelectedInput: React.RefObject<HTMLInputElement>;
};

type Props = {
  children: React.ReactNode;
};

export const ContextTodos = React.createContext({} as TodoContextProps);

export const TodoContext: React.FC<Props> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<number[]>([]);
  const [isEdited, setIsEdited] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [errMessage, setErrMessage] = useState('');
  const [stat, setStat] = useState(Status.all);
  const [visibleErr, setVisibleErr] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo[] | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const editSelectedInput = useRef<HTMLInputElement>(null);

  //for reset errors
  const resetErr = () =>
    setTimeout(() => {
      setVisibleErr(false);
      setErrMessage('');
    }, 3000);

  //   try {
  //     setIsLoading([updatedTodo.id]);
  //     const todoToUpdate = todos.find(tod => tod.id === updatedTodo.id);

  //     let newTodo: Todo = {
  //       id: 0,
  //       userId: 0,
  //       title: '',
  //       completed: false,
  //     };

  //     if (option === 'completed' && todoToUpdate) {
  //       newTodo = { ...todoToUpdate, completed: !updatedTodo.completed };
  //     }

  //     if (option === 'title' && todoToUpdate) {
  //       const trimedTitle = editedTitle.trim();

  //       if (trimedTitle === '') {
  //         setVisibleErr(true);
  //         setErrMessage('Title should not be empty');
  //         resetErr();
  //         deleteTodo(todoToUpdate.id).then(async () => {
  //           const loadTodos = getTodos();

  //           setTodos(await loadTodos);
  //         });

  //         return;
  //       }

  //       if (trimedTitle === todoToUpdate.title) {
  //         setEditedTitle('');

  //         return;
  //       }

  //       newTodo = { ...todoToUpdate, title: trimedTitle };
  //     }

  //     await patchTodo(newTodo).then(response =>
  //       setTodos(prevState => {
  //         if (prevState.find(todo => todo.id === response.id)) {
  //           return prevState.map(todo =>
  //             todo.id === response.id ? response : todo,
  //           );
  //         }

  //         return [...prevState];
  //       }),
  //     );
  //   } catch {
  //     setVisibleErr(true);
  //     setErrMessage('Unable to update a todo');
  //     resetErr();
  //   } finally {
  //     setIsLoading([]);
  //     setEditedTitle('');
  //   }
  // };

  const addTodo = async () => {
    const trimedTitle = newTitle.trim();

    if (trimedTitle === '') {
      setVisibleErr(true);
      setErrMessage('Title should not be empty');
      resetErr();

      return;
    }

    const newTodo: Todo = {
      id: 0,
      userId: 472,
      title: trimedTitle,
      completed: false,
    };

    const temp = {
      id: 0,
      userId: 472,
      title: trimedTitle,
      completed: false,
    };

    setTempTodo([...todos, temp]);

    try {
      setIsLoading([0]);

      await postTodo(newTodo).then(respond => {
        setTempTodo(null);
        setTodos(prevTodos => [...prevTodos, respond]);
        setNewTitle('');
      });
    } catch (error) {
      setIsLoading([]);
      setTempTodo(null);
      setVisibleErr(true);
      setErrMessage('Unable to add a todo');
      resetErr();
    } finally {
      setIsLoading([]);
    }
  };

  const removeTodo = async (todoToRemove: Todo) => {
    try {
      setIsLoading(state => [...state, todoToRemove.id]);

      await deleteTodo(todoToRemove.id).then(() =>
        setTodos(prevTodos => {
          return prevTodos.filter(prevTodo => prevTodo.id !== todoToRemove.id);
        }),
      );
    } catch {
      setVisibleErr(true);
      setErrMessage('Unable to delete a todo');
      resetErr();
    } finally {
      setIsLoading([]);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    addTodo();
  };

  return (
    <ContextTodos.Provider
      value={{
        resetErr,
        editSelectedInput,
        todos,
        isLoading,
        errMessage,
        isEdited,
        newTitle,
        stat,
        tempTodo,
        visibleErr,
        setErrMessage,
        setIsEdited,
        setIsLoading,
        setNewTitle,
        setStat,
        setTempTodo,
        setTodos,
        setVisibleErr,
        addTodo,
        handleSubmit,
        removeTodo,
      }}
    >
      {children}
    </ContextTodos.Provider>
  );
};
