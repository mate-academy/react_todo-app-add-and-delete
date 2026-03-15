import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

interface Props {
  message: string;
  onClose?: () => void;
}

const AUTO_HIDE_DELAY = 3000;

export const ErrorNotification: React.FC<Props> = ({
  message,
  onClose = () => {},
}) => {
  const [isHidden, setIsHidden] = useState(true);
  const boxRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);

  const stopAnimation = () => {
    if (animationRef.current) {
      animationRef.current.cancel();
      animationRef.current = null;
    }
  };

  const hideNow = () => {
    stopAnimation();
    setIsHidden(true);
    onClose();
  };

  useEffect(() => {
    stopAnimation();

    if (!message) {
      setIsHidden(true);

      return;
    }

    setIsHidden(false);

    const el = boxRef.current;

    if (!el || typeof el.animate !== 'function') {
      const id = window.setTimeout(hideNow, AUTO_HIDE_DELAY);

      return () => window.clearTimeout(id);
    }

    const anim = el.animate([{ opacity: 1 }, { opacity: 1 }], {
      duration: AUTO_HIDE_DELAY,
      fill: 'forwards',
    });

    animationRef.current = anim;

    anim.onfinish = () => {
      animationRef.current = null;
      setIsHidden(true);
      onClose();
    };

    return () => {
      stopAnimation();
    };
  }, [message, onClose]);

  return (
    <div
      ref={boxRef}
      data-cy="ErrorNotification"
      className={classNames('notification', 'is-danger', {
        hidden: isHidden,
      })}
    >
      <button
        type="button"
        data-cy="HideErrorButton"
        className="delete"
        onClick={hideNow}
      />
      {message}
    </div>
  );
};
