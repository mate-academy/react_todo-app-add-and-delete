import { useContext } from 'react';
import { TodoContext } from '../../../context/TodoContext';
import { TodoRender } from '../TodoRender/TodoRender';

export const TodoList = () => {
  const {
    filtredTodos,
    setInputValue,
    inputValue,
    handleStatusChange,
    selectedTodoId,
    setSelectedTodoId,
    handleChangeTitle,
    setLoadError,
    setErrorMessage,
  } = useContext(TodoContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filtredTodos.map(todo => (
        <TodoRender
          key={todo.id}
          todo={todo}
          handleStatusChange={handleStatusChange}
          selectedTodoId={selectedTodoId}
          setSelectedTodoId={setSelectedTodoId}
          setInputValue={setInputValue}
          inputValue={inputValue}
          handleChangeTitle={handleChangeTitle}
          setLoadError={setLoadError}
          setErrorMessage={setErrorMessage}
        />
      )) }
    </section>
  );
};
