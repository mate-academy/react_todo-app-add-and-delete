import { useState } from 'react';
import { Todo } from './types/Todo';

interface InputFormType {
  setFilteredTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setOnEmptyFormSubmit: React.Dispatch<React.SetStateAction<boolean>>,
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>
}

export const InputForm: React.FC<InputFormType>
  = ({ setFilteredTodos, setOnEmptyFormSubmit, setTempTodo }) => {
    const [inputValue, setInputValue] = useState('');
    const [isInputDisabled, setIsInputDisabled] = useState(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    };

    const handleFormSubmit = async (event:
    React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!inputValue) {
        setOnEmptyFormSubmit(true);

        return;
      }

      const todoData = {
        id: 0,
        userId: 10592,
        completed: false,
        title: inputValue,
      };

      setTempTodo(todoData);

      try {
        const response = await fetch(
          'https://mate.academy/students-api/todos?userId=10592', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(todoData),
          },
        );

        const result = await response.json();

        setFilteredTodos((prevTodos) => [...prevTodos, result]);
      } catch (error) {
        console.log(`An error occurred while adding a todo - ${error}`);
      } finally {
        setIsInputDisabled(false);
        setTempTodo(null);
      }

      setInputValue('');
    };

    return (
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={inputValue}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleInputChange}
          disabled={isInputDisabled}
        />
      </form>
    );
  };
