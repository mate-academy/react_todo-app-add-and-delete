import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { addTodo, getTodos, removeTodo } from './api/todos';
import { Header } from './components/Auth/Header/header';
import { TodoList } from './components/Auth/TodoList/TodoList';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Footer } from './components/Auth/Footer/footer';
import { Error } from './components/Auth/Error/Error';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState(Filter.ALL);
  const user = useContext(AuthContext);

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;

      case Filter.Completed:
        return todo.completed;

      case Filter.ALL:
      default:
        return todo;
    }
  });

  useEffect(() => {
    const loadTodos = async () => {
      if (!user) {
        return;
      }

      try {
        const todoFromServer = await getTodos(user.id);

        setTodos(todoFromServer);
      } catch {
        setError('Unable to add a todo');
      }
    };

    loadTodos();
  }, [user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError('Title can`t be empty');
      setTitle('');

      return;
    }

    let userId = 0;

    try {
      if (user?.id) {
        userId = user.id;
      }

      await addTodo(userId, title)
        .then(newTodo => {
          setTodos(prevTodos => [...prevTodos, newTodo]);
        });

      setTitle('');
    } catch {
      setError('Unable to add a todo');
    }
  };

  const deleteTodo = async (todoId: number) => {
    try {
      await removeTodo(todoId);

      setTodos(currnetTodos => currnetTodos.filter(
        todo => todo.id !== todoId,
      ));
    } catch {
      setError('Unable to delete a todo');
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          title={title}
          onSetTitle={setTitle}
          onSubmit={handleSubmit}
        />
        {todos && (
          <>
            <TodoList
              todos={filteredTodos}
              handleDelete={deleteTodo}
            />
            <Footer
              todos={filteredTodos}
              filter={filter}
              onSetFilter={setFilter}
              onDeleteTodo={deleteTodo}
            />
          </>
        )}
      </div>
      {error && (
        <Error
          error={error}
          errorMessage={setError}
        />
      )}
    </div>
  );
};
