import PropTypes from 'prop-types';

function Tab({ title, isActive = false, handleClick }) {
  return (
    <button
      onClick={handleClick}
      className={
        isActive
          ? 'transition-all leading-[1] rounded-full px-3 py-2 text-secondary bg-primary hover:opacity-80'
          : 'transition-all leading-[1] rounded-full px-3 py-2 bg-secondary border border-primary hover:opacity-80'
      }
    >
      {title}
    </button>
  );
}

Tab.propTypes = {
  title: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  handleClick: PropTypes.func.isRequired,
};

export default Tab;
