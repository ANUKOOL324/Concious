export function TestimonialCard({ name, role, text }: {
  name: string;
  role: string;
  text: string;
}) {
  return (
    <div className="min-w-[320px] bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-white shadow-lg">
      <p className="text-gray-300 mb-4">“{text}”</p>
      <div className="text-sm font-semibold">{name}</div>
      <div className="text-xs text-gray-400">{role}</div>
    </div>
  );
}
