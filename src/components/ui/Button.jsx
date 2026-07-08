import PropTypes from 'prop-types';

function Button({ children, type = 'button', variant = 'primary', ...props }) {
  return (
    <button type={type} className={`btn btn-${variant}`} {...props}>
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  variant: PropTypes.string,
};

export default Button;
