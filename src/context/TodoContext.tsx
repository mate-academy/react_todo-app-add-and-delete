import { createContext, useEffect, useState } from 'react';
import { createTodo, deleteTodo, getTodos } from '../api/todos';
import { Todo, TodoStatus } from '../types/Todo';

type Props = {
  children: React.ReactNode,
};

export interface ProvidedValue {
  todos: Todo[],
  tempTodo: Todo | null,
  todosContainer: Todo[],
  completedTodos: Todo[],
  selectedStatus: TodoStatus,
  errorMessage: string,
  processed: number[],
  USER_ID: number,
  filterByStatus: (status: TodoStatus) => void,
  onCreateTodo: (newTodo: Omit<Todo, 'id'>) => void,
  onError: (error: string) => void,
  onDeleteTodo: (todoId: number) => void,
  onDeleteCompleted: () => Promise<void>,
}

const USER_ID = 11033;

export const TodoContext = createContext({} as ProvidedValue);

export const TodoContextProvider = ({ children }: Props) => {
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosContainer, setTodosContainer] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const [selectedStatus, setSelectedStatus] = useState(TodoStatus.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [processed, setProcessed] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then((res) => {
        setTodos(res);
        setTodosContainer(res);
        setCompletedTodos(res.filter(todo => todo.completed));
      })
      .catch((error) => {
        throw error;
      });
  }, []);

  const filterByStatus = (status: TodoStatus) => {
    const filtered = todosContainer.filter(todo => {
      switch (status) {
        case TodoStatus.Active:
          return !todo.completed;
        case TodoStatus.Completed:
          return todo.completed;
        default:
          return todo;
      }
    });

    setTodos(filtered);
    setSelectedStatus(status);
  };

  const onError = (error: string) => {
    setErrorMessage(error);
  };

  const handleTempTodo = (todo?: Todo) => {
    if (todo) {
      setTempTodo(todo);
    } else {
      setTempTodo(null);
    }
  };

  const onCreateTodo = (newTodo: Omit<Todo, 'id'>) => {
    handleTempTodo({ ...newTodo, id: 0 });
    createTodo(newTodo).then((res) => {
      setTodosContainer([...todosContainer, res]);
      setTodos([...todosContainer, res]);
    }).catch(() => {
      onError('Unable to add a todo');
      handleTempTodo();
    })
      .finally(() => {
        handleTempTodo();
      });
  };

  const onDeleteTodo = (todoId: number) => {
    setProcessed([...processed, todoId]);
    deleteTodo(todoId)
      .then(() => {
        setTodosContainer(todosContainer.filter(todo => todo.id !== todoId));
        setTodos(todos.filter(todo => todo.id !== todoId));
      })
      .catch(() => onError('Unable to delete the todo'))
      .finally(() => setProcessed(processed));
  };

  const onDeleteCompleted = async () => {
    const deletePromises = completedTodos.map(todo => deleteTodo(todo.id));

    try {
      const ids = completedTodos.map(todo => todo.id);

      setProcessed([...processed, ...ids]);

      await Promise.all(deletePromises);
      setTodos(todos.filter(todo => !todo.completed));
      setTodosContainer(todosContainer.filter(todo => !todo.completed));
      setCompletedTodos([]);
    } catch (error) {
      onError('Unable to delete the todo');
    } finally {
      setProcessed(processed);
    }
  };

  const providedValue = {
    todos,
    tempTodo,
    todosContainer,
    completedTodos,
    selectedStatus,
    errorMessage,
    processed,
    USER_ID,
    filterByStatus,
    onCreateTodo,
    onError,
    onDeleteTodo,
    onDeleteCompleted,
  };

  return (
    <TodoContext.Provider value={providedValue}>
      {children}
    </TodoContext.Provider>
  );
};
