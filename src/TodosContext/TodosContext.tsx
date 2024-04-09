/* eslint-disable max-len */
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ErrorMessage } from '../types/ErrorMessage';
import { Todo } from '../types/Todo';
import * as todoService from '../api/todos';
import { FilteringBy } from '../types/FilteringBy';

interface TodosContextProps {
  isSubmiting: boolean;
  setSubmiting: React.Dispatch<React.SetStateAction<boolean>>;
  editedTodoTitle: string;
  setEditedTodoTitle: React.Dispatch<React.SetStateAction<string>>;
  handleSpanDoubleClick: (id: number, title: string) => void;
  handleDeleteTodo: (todoId: number) => void;
  editedTodoId: number | null;
  handleEditTodo: (
    event: React.FormEvent<HTMLFormElement>,
    todoId: number,
  ) => void;
  handleCompleteChange: (todoId: number, checked: boolean) => void;
  handleSetAllAsComplited: () => void;
  handlerFormSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  setErrorMessage: Dispatch<SetStateAction<ErrorMessage | null>>;
  temptTodo: Todo | null;
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  newTodoTitle: string;
  setNewTodoTitle: Dispatch<SetStateAction<string>>;
  errorMessage: ErrorMessage | null;
  handleClearCompleted: () => void;
  filteringBy: FilteringBy;
  setFilteringBy: Dispatch<SetStateAction<FilteringBy>>;
}

export const TodosContext = React.createContext<TodosContextProps>({
  isSubmiting: false,
  setSubmiting: () => {},
  editedTodoTitle: '',
  setEditedTodoTitle: () => {},
  handleSpanDoubleClick: () => {},
  handleDeleteTodo: () => {},
  editedTodoId: 0,
  handleEditTodo: () => {},
  handleCompleteChange: () => {},
  handleSetAllAsComplited: () => {},
  handlerFormSubmit: () => {},
  setErrorMessage: () => {},
  temptTodo: {
    id: 0,
    userId: 0,
    title: '',
    completed: false,
  },
  todos: [],
  setTodos: () => {},
  newTodoTitle: '',
  setNewTodoTitle: () => {},
  errorMessage: null,
  handleClearCompleted: () => {},
  filteringBy: FilteringBy.default,
  setFilteringBy: () => {},
});

export const USER_ID = 448;

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isSubmiting, setSubmiting] = useState(false);
  const [editedTodoTitle, setEditedTodoTitle] = useState('');
  const [editedTodoId, setEditedTodoId] = useState<null | number>(null);
  const [temptTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [filteringBy, setFilteringBy] = useState(FilteringBy.default);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);

  useEffect(() => {
    todoService
      .getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToLoadTodos);

        setTimeout(() => setErrorMessage(null), 3000);
      });
  }, []);

  const isAllCompleted = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  const handleSpanDoubleClick = (id: number, title: string) => {
    setEditedTodoId(id);
    setEditedTodoTitle(title);
  };

  const handleEditTodo = (
    event: React.FormEvent<HTMLFormElement>,
    todoId: number,
  ) => {
    event.preventDefault();

    if (editedTodoTitle) {
      todoService
        .editTodo(todoId, { title: editedTodoTitle })
        .then(() => {
          const todosWithEditedTodo = todos.map(todo => {
            if (todo.id === todoId) {
              return { ...todo, title: editedTodoTitle.trim() };
            }

            return todo;
          });

          setTodos(todosWithEditedTodo);

          setEditedTodoId(null);
        })
        .catch(() => {
          setErrorMessage(ErrorMessage.UnableToUpdateATodo);
          setTimeout(() => setErrorMessage(null), 3000);
        });
    }
  };

  const handleDeleteTodo = (todoId: number) => {
    todoService
      .deleteTodo(todoId)
      .then(() => {
        const todosWithoutDeleted = todos.filter(todo => todo.id !== todoId);

        setTodos(todosWithoutDeleted);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToDeleteATodo);
        setTimeout(() => setErrorMessage(null), 3000);
      });
  };

  const handleCompleteChange = (todoId: number, checked: boolean) => {
    todoService.editTodo(todoId, { completed: checked }).then(() => {
      todoService.getTodos(USER_ID).then(setTodos);
      setEditedTodoId(null);
    });
  };

  const handleSetAllAsComplited = () => {
    if (!isAllCompleted) {
      todos.forEach(todo => {
        if (!todo.completed) {
          handleCompleteChange(todo.id, true);
        }
      });
    } else {
      todos.forEach(todo => {
        handleCompleteChange(todo.id, false);
      });
    }
  };

  const handleClearCompleted = () => {
    const todosToDelete = todos.filter(todo => todo.completed);

    todosToDelete.map(todo => handleDeleteTodo(todo.id));
  };

  const handlerFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      setErrorMessage(ErrorMessage.TitleShouldNotBeEmpty);

      setTimeout(() => setErrorMessage(null), 3000);

      return;
    }

    setSubmiting(true);

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    };

    setTempTodo(newTodo);

    todoService
      .addTodo(USER_ID, newTodo)
      .then(todo => {
        setTodos(prevTodos => [...prevTodos, todo]);

        setNewTodoTitle('');
        setSubmiting(false);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToAddATodo);
        setTimeout(() => setErrorMessage(null), 3000);
        setSubmiting(false);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const value = {
    isSubmiting,
    setSubmiting,
    editedTodoTitle,
    setEditedTodoTitle,
    handleSpanDoubleClick,
    handleDeleteTodo,
    editedTodoId,
    handleEditTodo,
    handleCompleteChange,
    handleSetAllAsComplited,
    handlerFormSubmit,
    setErrorMessage,
    temptTodo,
    todos,
    setTodos,
    newTodoTitle,
    setNewTodoTitle,
    errorMessage,
    handleClearCompleted,
    filteringBy,
    setFilteringBy,
  };

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};
