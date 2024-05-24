import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { Todo } from './types/Todo';
import { USER_ID } from './api/todos';
import * as todoServices from './api/todos';
import { FilterField } from './utils/constants';

type ContextProps = {
  readyTodos: Todo[];
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  title: string;
  setTitle: (title: string) => void;
  handleSubmit: (event: FormEvent) => void;
  handleCompletedStatus: (todo: Todo) => void;
  errorMessage: string;
  setErrorMessage: (message: string) => void;
  selectedTodo: Todo | null;
  setSelectedTodo: (todo: Todo | null) => void;
  filterField: string;
  setFilterField: (field: string) => void;
  titleField: React.MutableRefObject<HTMLInputElement | null> | null;
  editingTitleField: React.MutableRefObject<HTMLInputElement | null> | null;
  handleDelete: (todo: Todo) => void;
  handleDeleteCompleted: () => void;
  isFormDisabled: boolean;
  isDeletion: boolean;
  tempTodo: Todo | null;
};

export const TodoContext = React.createContext<ContextProps>({
  readyTodos: [],
  todos: [],
  setTodos: () => {},
  title: '',
  setTitle: () => {},
  handleSubmit: () => {},
  handleCompletedStatus: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  selectedTodo: null,
  setSelectedTodo: () => {},
  filterField: '',
  setFilterField: () => {},
  titleField: null,
  editingTitleField: null,
  handleDelete: () => {},
  handleDeleteCompleted: () => {},
  isFormDisabled: false,
  isDeletion: false,
  tempTodo: null,
});

type Props = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  function preparedTodos(todos: Todo[], filterField: string) {
    const readyTodos = [...todos];

    if (filterField) {
      switch (filterField) {
        case FilterField.ALL:
          return readyTodos;

        case FilterField.ACTIVE:
          return readyTodos.filter(todo => !todo.completed);

        case FilterField.COMPLETED:
          return readyTodos.filter(todo => todo.completed);

        default:
          return readyTodos;
      }
    }

    return readyTodos;
  }

  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [filterField, setFilterField] = useState('all');
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [isDeletion, setIsDeletion] = useState(false);

  useEffect(() => {
    todoServices
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, []);

  const readyTodos = preparedTodos(todos, filterField);

  const titleField = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [todos]);

  const editingTitleField = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editingTitleField.current) {
      editingTitleField.current.focus();
    }
  }, [selectedTodo]);

  const handleCompletedStatus = (currentTodo: Todo) => {
    setTodos(
      todos.map(todo => {
        if (todo.id === currentTodo.id) {
          return { ...todo, completed: !todo.completed };
        }

        return todo;
      }),
    );
  };

  const addTodo = (newTodo: Todo) => {
    todoServices
      .createTodo(newTodo)
      .then(todo => {
        setTodos([...todos, todo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');

        setTimeout(() => {
          if (titleField.current) {
            titleField.current.focus();
          }

          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setIsFormDisabled(false);
        setTempTodo(null);
      });
  };

  const handleDelete = (currentTodo: Todo) => {
    setIsDeletion(true);

    todoServices
      .deletePost(currentTodo)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== currentTodo.id));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => {
          if (titleField.current) {
            titleField.current.focus();
          }

          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setIsDeletion(false);
      });
  };

  const handleDeleteCompleted = async () => {
    const newTodos = [...todos.filter(todo => todo.completed)];

    for (const todo of newTodos) {
      try {
        await todoServices.deletePost(todo);
        setTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));
      } catch {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => {
          if (titleField.current) {
            titleField.current.focus();
          }

          setErrorMessage('');
        }, 3000);
      } finally {
        setIsDeletion(false);
      }
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Title should not be empty');

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    setIsFormDisabled(true);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: 'Test Todo',
      completed: false,
    });

    addTodo({
      id: +new Date(),
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    });
  };

  const value = {
    readyTodos,
    todos,
    setTodos,
    title,
    setTitle,
    handleSubmit,
    handleCompletedStatus,
    errorMessage,
    setErrorMessage,
    selectedTodo,
    setSelectedTodo,
    filterField,
    setFilterField,
    titleField,
    editingTitleField,
    handleDelete,
    handleDeleteCompleted,
    isFormDisabled,
    isDeletion,
    tempTodo,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
