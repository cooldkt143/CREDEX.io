export default function Card({ title, children, className = "" }) {
  return (
    <div
      className={`max-w-full rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-8 ${className}`}
    >
      {title && (
        <h3 className="mb-6 text-2xl text-emerald-400 font-bold">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
