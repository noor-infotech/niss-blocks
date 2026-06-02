export default function ModernSaasHero() {
  return (
    <section className="bg-slate-900 text-white py-20 px-5 text-center font-sans">
      <span className="bg-blue-900 text-blue-300 px-4 py-1 rounded-full text-sm font-semibold">
        New · Version 2.0 launched 🚀
      </span>

      <h1 className="text-5xl font-extrabold mt-6 mb-4 leading-tight tracking-tight">
        Build faster with <br />
        <span className="text-blue-400">NISS Blocks</span>
      </h1>

      <p className="text-slate-400 text-lg max-w-xl mx-auto mb-9 leading-relaxed">
        Open-source landing page blocks with HTML, React, and AI prompts.
        Ship beautiful pages in minutes.
      </p>

      <div className="flex gap-3 justify-center flex-wrap">
        <a href="#" className="bg-blue-500 hover:bg-blue-600 text-white px-7 py-3.5 rounded-xl font-bold text-sm transition-colors">
          Get Started Free
        </a>
        <a href="#" className="border border-slate-600 hover:border-slate-400 text-slate-400 hover:text-slate-200 px-7 py-3.5 rounded-xl font-semibold text-sm transition-colors">
          View on GitHub →
        </a>
      </div>

      <p className="text-slate-600 text-xs mt-5">
        No credit card required · Free forever plan
      </p>
    </section>
  );
}
