import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

function Overlay({ children, handleClickOut, excludeHeader = false }) {
  const overlayRef = useRef(null);
  const [className, setClassName] = useState(
    'fixed left-0 w-full h-full overflow-auto z-40 bg-opacity-25 bg-black block'
  );

  useEffect(() => {
    if (excludeHeader) {
      setClassName((className) => (className += ' top-[80px] lg:top-[72px]'));
    } else {
      setClassName((className) => (className += ' top-0'));
    }
  }, [excludeHeader]);

  useEffect(() => {
    function handleClick(event) {
      if (!overlayRef.current) return;

      if (overlayRef.current === event.target) {
        handleClickOut();
      } else if (!overlayRef.current.contains(event.target)) {
        handleClickOut();
      }
    }

    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [handleClickOut]);

  return (
    <>
      <div ref={overlayRef} className={className}>
        {children}
      </div>
      {excludeHeader && (
        <div className="fixed left-0 top-0 h-[80px] lg:h-[72px] w-full overflow-auto z-40 bg-transparent block"></div>
      )}
    </>
  );
}

Overlay.propTypes = {
  children: PropTypes.node,
  handleClickOut: PropTypes.func,
  excludeHeader: PropTypes.bool,
};

export default Overlay;
