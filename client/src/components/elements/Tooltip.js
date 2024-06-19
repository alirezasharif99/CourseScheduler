import React, { useRef, useEffect } from 'react';
import { Tooltip as BSTooltip } from 'bootstrap';
const Tooltip = ({ text, children }) => {
  const ref = useRef(0);

  useEffect(() => {
    new BSTooltip(ref.current, {
      title: text,
      placement: 'top',
      trigger: 'hover'
    });
  }, [text]);

  return React.cloneElement(children, { ref });
};

export default Tooltip;
