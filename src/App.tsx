import React, {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createTodo, deleteTodo, getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Errors } from './components/Errors';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { FilterType } from './types/FilterType';
import { Todo } from './types/Todo';

export function filterTodos(
  todos: Todo[],
  filterType: string,
) {
  const filteredTodos = todos.filter((todo) => {
    switch (filterType) {
      case 'completed':
        return todo.completed;

      case 'active':
        return !todo.completed;

      default:
        return todo;
    }
  });

  return filteredTodos;
}

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredBy, setFilteredBy] = useState<FilterType>(FilterType.All);
  const [title, setTitle] = useState('');
  const [errorText, setErrorText] = useState('');
  const [selectedId, setSelectedId] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const visibleTodos = filterTodos(todos, filteredBy);

  useEffect(() => {
    const todosFromServer = async () => {
      if (user) {
        const getedTodos = getTodos(user.id);

        setTodos(await getedTodos);
      }
    };

    todosFromServer();

    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const addTodo = useCallback(async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim || !user) {
      setErrorText("You can't do something if you don't know what exactly.");

      return;
    }

    setIsAdding(true);

    try {
      const postTodo = await createTodo(title, user.id);

      setTodos((prevTodos) => [...prevTodos, postTodo]);
    } catch {
      setErrorText('123');
    }

    setIsAdding(false);
    setTitle('');
  }, [title, user]);

  const removeTodo = useCallback(async (TodoId: number) => {
    setSelectedId([TodoId]);
    try {
      await deleteTodo(TodoId);

      setTodos((prevTodos) => prevTodos.filter(({ id }) => id !== TodoId));
    } catch {
      setErrorText('456');
    }
  }, [todos, errorText]);

  const completedTodos = useMemo(
    () => todos.filter(({ completed }) => completed),
    [todos],
  );

  const deleteCompletedTodos = useCallback(() => {
    setSelectedId(completedTodos.map(({ id }) => id));

    Promise.all(completedTodos.map(({ id }) => removeTodo(id)))
      .then(() => setTodos((prevTodos) => prevTodos
        .filter(({ completed }) => !completed)))
      .catch(() => {
        setErrorText('321');
        setSelectedId([]);
      });
  }, [todos, selectedId, errorText]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodosField={newTodoField}
          addNewTodo={addTodo}
          setTitle={setTitle}
          title={title}
        />

        {(todos.length > 0 || isAdding)
        && (
          <TodoList
            todos={visibleTodos}
            removeTodo={removeTodo}
            selectedId={selectedId}
            isAdding={isAdding}
          />
        )}

        <Footer
          todos={todos}
          setFilter={setFilteredBy}
          filterStatus={filteredBy}
          clearCompleted={deleteCompletedTodos}
        />
      </div>

      {errorText
      && <Errors errorText={errorText} setErrorText={setErrorText} />}

    </div>
  );
};
