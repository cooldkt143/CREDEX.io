const StepThree = ({ formData, handleChange }) => {
  return (
    <div className="min-w-full px-6 sm:px-8 pb-8 overflow-y-auto">
      <p className="text-teal-400 mb-4">// platform.identities</p>

      <div className="space-y-4">
        <input
          name="github"
          placeholder="github_username"
          value={formData.github}
          onChange={handleChange}
          className="input"
        />
        <input
          name="linkedin"
          placeholder="linkedin_id"
          value={formData.linkedin}
          onChange={handleChange}
          className="input"
        />
        <input
          name="hackerrank"
          placeholder="hackerrank_id"
          value={formData.hackerrank}
          onChange={handleChange}
          className="input"
        />
      </div>
    </div>
  );
};

export default StepThree;
