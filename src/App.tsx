import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Header } from './components/header';
import { TodoList } from './components/todoList';
import { Footer } from './components/footer';
import { Notification } from './components/notification';
import { Todo } from './types/Todo';
import { Completed } from './types/Filters';
import { handlefilterTodos } from './utils/filterTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filtersParams, setFiltersParams] = useState(Completed.All);
  const [messageError, setMessageError] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [selectedTodo, setSelectedTodo] = useState(NaN);
  const [isDelComplited, setDelComplited] = useState(false);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setMessageError('Unable to load todos'));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setMessageError(''), 3000);

    return () => clearTimeout(timer);
  }, [messageError]);

  const addNewTodo = (newTodo: Todo): Promise<Todo | void> => {
    return addTodo(newTodo).then(todo => {
      setTodos(prevTodos => [...prevTodos, todo]);
    });
  };

  const removeTodo = (todoId: number) => {
    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => setMessageError('Unable to delete a todo'));
  };

  const clearCompleted = () => {
    setDelComplited(true);
    const filteredByCompleted = todos.filter(todo => todo.completed);

    const removeCompleted = filteredByCompleted.map(todo =>
      deleteTodo(todo.id).then(() => todo.id),
    );

    Promise.allSettled(removeCompleted)
      .then(results => {
        results.forEach(result => {
          if (result.status === 'fulfilled') {
            setTodos(prevTodos =>
              prevTodos.filter(todo => todo.id !== result.value),
            );
          } else {
            setMessageError('Unable to delete a todo');
          }
        });
      })
      .finally(() => setDelComplited(false));
  };

  const filterTodos = handlefilterTodos(todos, filtersParams);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          tempTodo={tempTodo}
          onSetError={setMessageError}
          onTodoDefault={setTempTodo}
          onNewTodo={addNewTodo}
        />
        <TodoList
          todos={filterTodos}
          tempTodo={tempTodo}
          doneTask={isDelComplited}
          selectedTodo={selectedTodo}
          onDeleteTodo={removeTodo}
          onSelectedTodo={setSelectedTodo}
        />
        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <Footer
            filterParam={filtersParams}
            todos={todos}
            doneTask={isDelComplited}
            onSetParam={setFiltersParams}
            onClearCompleted={clearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Notification messageError={messageError} onSetError={setMessageError} />
    </div>
  );
};
