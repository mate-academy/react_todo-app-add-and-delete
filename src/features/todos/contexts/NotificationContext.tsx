import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ErrorType } from '../model/types';

type NotificationMessage = string | ErrorType;

type NotificationContextType = {
  message: string;
  isVisible: boolean;
  bump: boolean;
  showNotification: (msg: NotificationMessage) => void;
  hideNotification: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

const SHOW_TIME = 3000;
const BUMP_TIME = 250;

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [bump, setBump] = useState(false);

  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bumpTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (bumpTimerRef.current) {
      clearTimeout(bumpTimerRef.current);
      bumpTimerRef.current = null;
    }
  };

  const showNotification = (msg: NotificationMessage) => {
    clearTimers();

    setMessage(msg);
    setIsVisible(true);

    setBump(true);
    bumpTimerRef.current = setTimeout(() => {
      setBump(false);
    }, BUMP_TIME);

    hideTimerRef.current = setTimeout(() => {
      setIsVisible(false);
      setMessage('');
      setBump(false);
    }, SHOW_TIME);
  };

  const hideNotification = () => {
    clearTimers();
    setIsVisible(false);
    setBump(false);
    setMessage('');
  };

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{ message, isVisible, bump, showNotification, hideNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);

  if (!ctx) {
    throw new Error(
      'useNotification must be used within a NotificationProvider',
    );
  }

  return ctx;
};
