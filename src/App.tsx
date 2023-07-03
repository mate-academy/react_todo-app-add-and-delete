import React, { useEffect, useCallback, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { Footer } from './components/todoFooter';
import { Message } from './components/ErrorMessege';
import { Todo, NewTodo } from './types/Todo';
import { getTodos } from './api/todos';
import { client } from './utils/fetchClient';
import { TodoStatus } from './types/TodoStatus';
import { FilterTodos } from './utils/todoFilter';

export const USER_ID = 10883;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoFilter, setTodoFilter] = useState<TodoStatus>(TodoStatus.All);
  const [visibleError, setVisibleError] = useState('');

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setVisibleError('Unable to load todos');
      });
  }, []);

  const addTodo = useCallback((title: string) => {
    try {
      const newTodo: NewTodo = {
        userId: USER_ID,
        completed: false,
        title,
      };

      client.post<Todo>(`/todos?userId=${USER_ID}`, newTodo)
        .then((response) => {
          setTodos((prevTodos: Todo[]) => [...prevTodos, response]);
        })
        .catch(() => {
          setVisibleError("Can't add todo");
        });

      return newTodo;
    } catch (error) {
      setVisibleError('Can\'t add todo');

      return null;
    }
  }, []);

  const removeTodo = useCallback((id: number) => {
    client.delete(`/todos/${id}`)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setVisibleError("Can't delete todo");
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <Header
        todos={todos}
        setVisibleError={setVisibleError}
        addTodo={addTodo}
      />

      <div className="todoapp__content">

        <TodoList
          todos={FilterTodos(todos, todoFilter)}
          removeTodo={removeTodo}
        />

        {todos.length > 0 && (
          <Footer
            setTodoFilter={setTodoFilter}
            todoFilter={todoFilter}
            todos={todos}
          />
        )}
      </div>

      <Message
        visibleError={visibleError}
        setVisibleError={setVisibleError}
      />
    </div>
  );
};
