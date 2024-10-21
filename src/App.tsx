import React, { useEffect, useState } from 'react';

import { createTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { getFilteredTodos } from './utils/getFilterdTodos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Error } from './components/Error';
import { TypeError } from './types/TypeError';
import { SelectedType } from './types/SelectedType';
import { Header } from './components/Header';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<TypeError>(
    TypeError.DEFAULT,
  );
  const [selectedOption, setSelectedOption] = useState<SelectedType>(
    SelectedType.ALL,
  );
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [temptTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);

  const filteredTodos = getFilteredTodos(todos, selectedOption);

  const handleAddTodo = (newTodo: Omit<Todo, 'id'>) => {
    createTodo(newTodo)
      .then(addedTodo => {
        setTodos(currentTodos => [...currentTodos, addedTodo]);
        setNewTitle('');
      })
      .catch(() => {
        setErrorMessage(TypeError.ADDING);
      })
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoading(true);
    setDeletingTodoIds(currentIds => [...currentIds, todoId]);
    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(TypeError.DELETING);
      })
      .finally(() => {
        setLoading(false);
        setDeletingTodoIds([]);
      });
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(TypeError.LOADING));
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          setErrorMessage={setErrorMessage}
          onAddTodo={handleAddTodo}
          setLoading={setLoading}
          loading={loading}
          setTempTodo={setTempTodo}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              temptTodo={temptTodo}
              onDeleteTodo={handleDeleteTodo}
              deletingTodoIds={deletingTodoIds}
            />

            <Footer
              todos={todos}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              handleDeleteTodo={handleDeleteTodo}
            />
          </>
        )}
      </div>

      <Error errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
