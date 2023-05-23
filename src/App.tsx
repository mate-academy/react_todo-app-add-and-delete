/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './Components/TodoList';
import { FilterType } from './types/FilterType';
import { ErrorMessage } from './Components/ErrorMessage';
import { Header } from './Components/Header';
import { Footer } from './Components/Footer';

const USER_ID = 10390;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(FilterType.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const completedTodo = todos.filter(todo => todo.completed === true);
  const activeTodos = todos.length - completedTodo.length;

  const filteredTodo = useMemo(() => {
    switch (filterBy) {
      case FilterType.Active:
        return todos.filter(todo => !todo.completed);

      case FilterType.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [todos, filterBy]);

  const createTodo = (newTodo: Todo) => {
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  const loadTodos = useCallback(async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setErrorMessage('Unable to add todo');
    }
  }, []);

  const onDeleteError = useCallback(
    async () => setErrorMessage(''), [errorMessage],
  );

  const handleFormSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!title.trim()) {
        // setErrorMessage('Title can\'t be empty');
        setErrorMessage('Sergii are you seriously?');

        return;
      }

      setErrorMessage('');

      const todoToAdd: Todo = {
        id: 0,
        title,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo({ ...todoToAdd });

      try {
        const newTodo = await addTodo(todoToAdd);

        createTodo(newTodo);
        setTitle('');
      } catch {
        setErrorMessage('Unable to add todo');
      }

      setTempTodo(null);
    }, [title],
  );

  const handleDelete = useCallback(async (todoToDelete: Todo) => {
    try {
      onDeleteError();
      setTempTodo(todoToDelete);
      await deleteTodo(todoToDelete.id);
      loadTodos();
    } catch {
      setErrorMessage('Unable to delete a todo');
    }

    setTempTodo(null);
  }, []);

  const handleAllDelete = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed === true);

    completedTodos.map(todo => handleDelete(todo));
  }, [todos]);

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <Header
        filteredTodo={filteredTodo}
        completedTodo={completedTodo}
        handleFormSubmit={handleFormSubmit}
        title={title}
        setTitle={setTitle}
      />
      <TodoList
        todos={filteredTodo}
        onDelete={handleDelete}
        tempTodo={tempTodo}
      />

      {todos.length > 0 && (
        <Footer
          activeTodos={activeTodos}
          completedTodo={completedTodo}
          handleAllDelete={handleAllDelete}
          setFilterBy={setFilterBy}
          filterBy={filterBy}
        />
      )}
      <ErrorMessage message={errorMessage} onDelete={onDeleteError} />
    </div>
  );
};
