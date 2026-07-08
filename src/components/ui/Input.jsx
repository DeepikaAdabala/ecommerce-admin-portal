import PropTypes from 'prop-types';

function Input({ label, error, ...props }) {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <input className={`form-control ${error ? 'is-invalid' : ''}`} {...props} />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
};

export default Input;
