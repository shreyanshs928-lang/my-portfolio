import React, { createContext, useState } from 'react';

export const CursorContext = createContext({
  cursorType: 'default',
  cursorLabel: '',
  setCursorType: () => {},
  setCursorLabel: () => {},
  magneticElement: null,
  setMagneticElement: () => {}
});

export const CursorProvider = ({ children }) => {
  const [cursorType, setCursorType] = useState('default');
  const [cursorLabel, setCursorLabel] = useState('');
  const [magneticElement, setMagneticElement] = useState(null);

  const triggerHover = (label = '') => {
    setCursorType('hover');
    setCursorLabel(label);
  };

  const triggerDefault = () => {
    setCursorType('default');
    setCursorLabel('');
    setMagneticElement(null);
  };

  const triggerActive = () => {
    setCursorType('active');
  };

  return (
    <CursorContext.Provider value={{
      cursorType,
      cursorLabel,
      setCursorType,
      setCursorLabel,
      magneticElement,
      setMagneticElement,
      triggerHover,
      triggerDefault,
      triggerActive
    }}>
      {children}
    </CursorContext.Provider>
  );
};
