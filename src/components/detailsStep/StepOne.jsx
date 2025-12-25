const StepOne = ({ formData, handleChange }) => {
  return (
    <div className="min-w-full px-6 sm:px-8 pb-8 overflow-y-auto">
      <p className="text-teal-400 mb-4">// personal.details</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          name="firstName"
          placeholder="first_name"
          value={formData.firstName}
          onChange={handleChange}
          className="input"
        />
        <input
          name="lastName"
          placeholder="last_name"
          value={formData.lastName}
          onChange={handleChange}
          className="input"
        />
        <input
          name="email"
          placeholder="email"
          value={formData.email}
          onChange={handleChange}
          className="input"
        />
        <input
          name="phone"
          placeholder="phone"
          value={formData.phone}
          onChange={handleChange}
          className="input"
        />
      </div>

      {/* Description */}
      <div className="mt-5">
        <p className="text-xs text-gray-400 mb-2">// short.description</p>
        <textarea
          name="description"
          placeholder="tell something about yourself..."
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="input resize-none"
        />
      </div>
    </div>
  );
};

export default StepOne;