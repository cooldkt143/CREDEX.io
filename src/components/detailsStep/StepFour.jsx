const StepFour = ({ formData }) => {
  return (
    <div className="min-w-full px-6 sm:px-8 pb-8 overflow-y-auto">
      <p className="text-teal-400 text-lg mb-4">// review.details</p>

      <div className="text-base text-gray-300 space-y-2">
        <p><span className="text-teal-400">name:</span> {formData.firstName} {formData.lastName}</p>
        <p><span className="text-teal-400">email:</span> {formData.email}</p>
        <p><span className="text-teal-400">phone:</span> {formData.phone}</p>
        <p><span className="text-teal-400">role:</span>{" "}
          {formData.role.length > 0 ? formData.role.join(", ") : "—"}
        </p>
        <p><span className="text-teal-400">description:</span>{" "}
          {formData.description || "—"}
        </p>
        <p><span className="text-teal-400">github:</span> {formData.github}</p>
        <p><span className="text-teal-400">linkedin:</span> {formData.linkedin}</p>
        <p><span className="text-teal-400">hackerrank:</span> {formData.hackerrank}</p>
      </div>
    </div>
  );
};

export default StepFour;
