 // app/page.js
import Dashboard from "@/components/Dashboard";

export default function Home() {
  return (
    <div className="w-full py-0">
      <header className="mb-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Portfolio Overview
        </h1>
      </header>
      
      <section className="animate-in fade-in duration-700">
        <Dashboard />
      </section>
    </div>
  );
}