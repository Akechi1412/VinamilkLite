import PropTypes from 'prop-types';

function Loading({ fullScreen = false }) {
  let className = 'flex justify-center items-center';
  if (fullScreen) {
    className += ' fixed top-0 left-0 w-screen h-screen z-[999] bg-secondary';
  } else {
    className += ' w-full h-full';
  }

  return (
    <div className={className}>
      <div className="border-4 border-white border-t-primary rounded-full w-[40px] h-[40px] animate-spin"></div>
    </div>
  );
}

Loading.propTypes = {
  fullScreen: PropTypes.bool,
};

export default Loading;
