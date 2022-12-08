import React, { useContext, useEffect, useState } from 'react';
import { addTodo, getTodos, removeTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotes } from './components/ErrorNotes/ErrorNotes';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { SingleTodo } from './components/SingleTodo';
import { Todos } from './components/Todos';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [errorType, setErrorType] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [activeTodoId, setActiveTodoId] = useState<number[]>([]);

  const loadTodos = async () => {
    if (!user) {
      return;
    }

    try {
      const todosFromServer = await getTodos(user.id);

      setTodos(todosFromServer);
      setFilteredTodos(todosFromServer);
    } catch (error) {
      setErrorType('unable to download todo');
      setTimeout(() => setErrorType(''), 3000);
      throw new Error(`Error is ${error}`);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const add = async (todo: Todo) => {
    if (!newTodoTitle) {
      setErrorType('Title can\'t be empty');
      setTimeout(() => setErrorType(''), 3000);

      return;
    }

    setIsAdding(true);
    setActiveTodoId([todo.id]);

    if (!user || !todo) {
      return;
    }

    const response = await addTodo(user.id, todo);

    try {
      setTodos([...todos, response]);
    } catch (error) {
      setErrorType('Unable to add a todo');
      setTimeout(() => setErrorType(''), 3000);
      throw new Error(`Error is ${error}`);
    } finally {
      setIsAdding(false);
      setTempTodo(null);
      setNewTodoTitle('');
      setActiveTodoId([]);
    }
  };

  const remove = async (ids: number[]) => {
    if (!user) {
      return;
    }

    setActiveTodoId(ids);

    const response = await Promise.all([...ids].map(id => {
      const todoToremove = todos.find(todo => todo.id === id);

      if (!todoToremove) {
        return null;
      }

      return removeTodo(user.id, todoToremove.id);
    }));

    try {
      const todosToStay = [...filteredTodos]
        .filter(todo => !ids.includes(todo.id));

      setTodos(todosToStay);
    } catch (error) {
      setErrorType('Unable to delete a todo');
      setTimeout(() => setErrorType(''), 3000);
      throw new Error(`${error} ${response}`);
    } finally {
      setActiveTodoId([]);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setTempTodo={setTempTodo}
          setNewTodoTitle={setNewTodoTitle}
          newTodoTitle={newTodoTitle}
          isAdding={isAdding}
          add={add}
        />

        {(!!todos.length || isAdding) && (
          <>
            <Todos
              todos={filteredTodos}
              activeTodoId={activeTodoId}
              remove={remove}
            />
            {isAdding && tempTodo && (
              <SingleTodo
                todo={tempTodo}
                activeTodoId={activeTodoId}
                remove={remove}
              />
            )}
            <Footer
              setFilteredTodos={setFilteredTodos}
              todos={todos}
              remove={remove}
            />
          </>
        )}
      </div>
      <ErrorNotes
        errorType={errorType}
        setErrorType={setErrorType}
      />
    </div>
  );
};
