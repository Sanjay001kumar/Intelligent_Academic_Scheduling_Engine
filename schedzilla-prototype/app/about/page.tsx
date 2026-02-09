export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-blue-600 mb-6">About Schedzilla</h1>
          <p className="text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
            This app helps generate timetables aligned with NEP 2020 for 
            multidisciplinary education structures.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-16">
          {/* Project Overview */}
          <section className="bg-white p-8 rounded-2xl border border-blue-200 shadow-sm">
            <h2 className="text-3xl font-bold text-blue-900 mb-6">🎯 Project Overview</h2>
            <p className="text-slate-700 text-lg leading-relaxed mb-4">
              Schedzilla is an AI-based timetable generation system specifically designed to handle the complexity 
              introduced by the National Education Policy (NEP) 2020. Our system manages multidisciplinary education 
              structures including Four-Year Undergraduate Programmes (FYUP), B.Ed., M.Ed., and ITEP programs.
            </p>
            <p className="text-slate-700 text-lg leading-relaxed">
              The system eliminates manual scheduling conflicts while optimizing faculty workload, venue utilization, 
              and student preferences through advanced algorithms and intelligent constraint solving.
            </p>
          </section>

          {/* Features */}
          <section>
            <h2 className="text-3xl font-bold text-blue-900 mb-8">🚀 Key Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Smart Conflict Resolution</h3>
                <p className="text-slate-700">Automatically detects and resolves scheduling conflicts across faculty, venues, and student groups.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3">NEP 2020 Compliance</h3>
                <p className="text-slate-700">Fully aligned with National Education Policy requirements for flexible, multidisciplinary programs.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="text-3xl mb-3">🎨</div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Intuitive Dashboard</h3>
                <p className="text-slate-700">Easy-to-use interface for managing faculties, students, courses, and venues.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="text-3xl mb-3">📄</div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Export Options</h3>
                <p className="text-slate-700">Download generated timetables in PDF or Excel formats for easy sharing.</p>
              </div>
            </div>
          </section>

          {/* Technology Stack */}
          <section className="bg-white p-8 rounded-2xl border border-blue-200 shadow-sm">
            <h2 className="text-3xl font-bold text-blue-900 mb-6">💻 Technology Stack</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-blue-900 mb-4">Frontend</h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• Next.js with TypeScript</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• Auth.js for authentication</li>
                  <li>• Responsive design</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-900 mb-4">Backend</h3>
                <ul className="space-y-2 text-slate-700">
                  <li>• Python with FastAPI</li>
                  <li>• SQLAlchemy ORM</li>
                  <li>• PostgreSQL database</li>
                  <li>• AI-powered scheduling algorithms</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-3xl font-bold text-blue-900 mb-8">📧 Contact Us</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">Development Team</h3>
                <div className="space-y-3 text-slate-700">
                  <p><strong>Email:</strong> team@schedzilla.edu</p>
                  <p><strong>Support:</strong> support@schedzilla.edu</p>
                  <p><strong>GitHub:</strong> github.com/schedzilla</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">Institution</h3>
                <div className="space-y-3 text-slate-700">
                  <p><strong>Address:</strong> Department of Computer Science</p>
                  <p><strong>University:</strong> Academic Excellence Institute</p>
                  <p><strong>Phone:</strong> +91 12345 67890</p>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-white p-8 rounded-2xl border border-blue-200 shadow-sm">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Ready to Transform Your Scheduling?</h2>
            <p className="text-slate-700 mb-6">Join institutions already using Schedzilla to manage their academic schedules efficiently.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/generator" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md"
              >
                Try Generator
              </a>
              <a 
                href="/dashboard" 
                className="border border-blue-600 hover:bg-blue-600 hover:text-white text-blue-600 px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                View Dashboard
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
