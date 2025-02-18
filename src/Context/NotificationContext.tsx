import React, { createContext, useContext, useState, useEffect } from 'react';

type NotificationContextType = {
  message: string;
  isVisible: boolean;
  showNotification: (msg: string) => void;
  hideNotification: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [message, setMessage] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const showNotification = (msg: string) => {
    setMessage(msg);
    setIsVisible(true);

    setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  };

  const hideNotification = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!isVisible && message) {
      timer = setTimeout(() => setMessage(''), 300);
    }

    return () => clearTimeout(timer);
  }, [isVisible, message]);

  return (
    <NotificationContext.Provider
      value={{ message, isVisible, showNotification, hideNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider',
    );
  }

  return context;
};
