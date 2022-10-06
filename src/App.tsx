/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  // useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { Error } from './components/Errors/Error';

import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { deleteTodo, getTodos, postTodo } from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<Filter>(Filter.All);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAdding, setisAdding] = useState(true);
  const [title, setTitle] = useState('');
  const [selectedId, setSelectedId] = useState<number[]>([]);

  const user = useContext(AuthContext);

  let userId = 0;

  if (user?.id) {
    userId = user?.id;
  }

  useEffect(() => {
    getTodos(userId)
      .then(response => setTodos(response))
      .catch(() => setError(true));
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.length) {
      setError(true);

      return setErrorMessage('Title can`t be empty');
    }

    if (user) {
      await postTodo(user.id, title)
        .then((newTodo: Todo) => {
          setTodos([...todos, newTodo]);
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');
        });
    }

    setisAdding(false);

    return setTitle('');
  };

  const handleRemoveTodo = async (todoId: number) => {
    setSelectedId([todoId]);
    setisAdding(true);

    await deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      });

    setisAdding(true);
  };

  const filteredTodos = todos.filter(todo => {
    switch (filterBy) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      default:
        return todos;
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      {todos && (
        <div className="todoapp__content">
          <Header
            title={title}
            setTitle={setTitle}
            handleSubmit={handleSubmit}
          />
          <TodoList
            todos={filteredTodos}
            OnRemove={handleRemoveTodo}
            selectedId={selectedId}
            isAdding={isAdding}
          />
          <Footer
            todos={filteredTodos}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
          />
        </div>
      )}
      <Error
        errorMessage={errorMessage}
        error={error}
        setError={setError}
      />
    </div>
  );
};
