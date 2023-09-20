import {
  useState, createContext, useMemo,
} from 'react';
import { Todo } from '../types/Todo';

export const TodoContext = createContext<{
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  tempTodo: Todo | null;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
}>({
  todos: [],
  setTodos: () => {},
  tempTodo: null,
  setTempTodo: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  // useEffect(() => {
  //   const todosStorage = localStorage.getItem('todos');

  //   setTodos(JSON.parse(todosStorage || '[]') as Todo[]);
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem('todos', JSON.stringify(todos));
  // }, [todos]);

  const value = useMemo(() => ({
    todos,
    setTodos,
    tempTodo,
    setTempTodo,
  }), [todos, tempTodo]);

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
