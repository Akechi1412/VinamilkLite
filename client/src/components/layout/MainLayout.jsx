import PropTypes from 'prop-types';
import { Header, Footer } from '../common';
import { useEffect, useState } from 'react';

function MainLayout({ children, hasTransitionHeader = false }) {
  const [className, setClassName] = useState('min-h-screen flex flex-col');

  useEffect(() => {
    if (!hasTransitionHeader) {
      setClassName(
        (className) =>
          (className += ' before:block before:bg-transparent before:h-[72px] lg:before:hidden')
      );
    }
  }, [hasTransitionHeader]);

  return (
    <div className={className}>
      <Header hasTransiton={hasTransitionHeader} />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
  hasTransitionHeader: PropTypes.bool,
};

export default MainLayout;
