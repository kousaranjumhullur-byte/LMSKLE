import React, { useState, useEffect } from "react";
import { 
  Trophy, 
  Plus, 
  Trash2, 
  Edit, 
  BookOpen, 
  Users, 
  ShieldCheck, 
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  LayoutDashboard,
  Library,
  UserSquare2,
  BookMarked,
  ArrowDownLeft,
  ArrowUpRight,
  Calculator,
  BarChart3,
  Bell,
  LogOut,
  Menu,
  X,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Book, UserRole, BookStatus, Student, Employee, Loan } from "./types";

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [role, setRole] = useState<UserRole>("Admin"); // Defaulting to Admin for dashboard preview
  const [search, setSearch] = useState("");
  const searchRef = React.useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState<Book | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  const [isAdding, setIsAdding] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<
    "Home" | "Dashboard" | "Books" | "Students" | "Employees" | "Issued" | "Returned" | "Fines" | "Reports" | "Notifications" | "Blog" | "About" | "Contact"
  >("Home");

  const blogPosts = [
    {
      title: "The Physics of Speed: Understanding Aerodynamics",
      author: "Adrian Newey",
      date: "May 10, 2024",
      url: "https://medium.com/topic/motorsports",
      category: "Engineering",
      image: "https://images.unsplash.com/photo-1541443131876-44b03de101c5?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "Clean Code in High-Performance Systems",
      author: "Dan Vanderkam",
      date: "April 28, 2024",
      url: "https://medium.com/topic/programming",
      category: "Software",
      image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "Data Driven Strategies: Winning the Championship",
      author: "Toto Wolff",
      date: "April 15, 2024",
      url: "https://medium.com/topic/business",
      category: "Strategy",
      image: "https://images.unsplash.com/photo-1553484771-047a44eee27b?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "The Evolution of Turbocharged Engines",
      author: "Lewis Hamilton",
      date: "March 22, 2024",
      url: "https://medium.com/topic/technology",
      category: "Performance",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600"
    }
  ];

  // Fetch data
  useEffect(() => {
    fetch("/api/books")
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.error("Books fetch failed", err));

    // Mock Students
    setStudents([
      { id: "S1", name: "Rahul Sharma", email: "rahul.s@kle.edu", rollNumber: "2021CS045", department: "Computer Science", joinedDate: "2021-08-15" },
      { id: "S2", name: "Priya Patel", email: "priya.p@kle.edu", rollNumber: "2022EC012", department: "Electronics", joinedDate: "2022-09-01" },
      { id: "S3", name: "Amit Kumar", email: "amit.k@kle.edu", rollNumber: "2020ME088", department: "Mechanical", joinedDate: "2020-08-20" },
    ]);

    // Mock Employees
    setEmployees([
      { id: "E1", name: "Dr. Vinay Hegde", email: "vinay.h@kle.edu", employeeId: "KLE-EMP-001", department: "Engineering", joinedDate: "2015-06-10" },
      { id: "E2", name: "Sarah Jones", email: "sarah.j@kle.edu", employeeId: "KLE-EMP-042", department: "Research", joinedDate: "2018-11-22" },
    ]);

    // Mock Loans
    setLoans([
      { id: "L1", bookId: "1", bookTitle: "Effective TypeScript", userId: "S1", userName: "Rahul Sharma", issueDate: "2024-05-01", dueDate: "2024-05-15", status: "Issued", fine: 0 },
      { id: "L2", bookId: "3", bookTitle: "The Phoenix Project", userId: "S2", userName: "Priya Patel", issueDate: "2024-04-20", dueDate: "2024-05-04", status: "Overdue", fine: 250 },
      { id: "L3", bookId: "2", bookTitle: "Clean Code", userId: "E1", userName: "Dr. Vinay Hegde", issueDate: "2024-05-05", dueDate: "2024-05-19", status: "Returned", returnDate: "2024-05-10", fine: 0 },
    ]);
  }, []);

  // Helper components
  function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
    return (
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
          active 
            ? "bg-f1-red text-white shadow-lg shadow-f1-red/20 translate-x-1" 
            : "text-gray-400 hover:text-white hover:bg-gray-800"
        }`}
      >
        <span className={active ? "scale-110" : ""}>{icon}</span>
        <span className="text-[11px]">{label}</span>
        {active && <motion.div layoutId="active-pill" className="ml-auto w-1 h-3 bg-white rounded-full" />}
      </button>
    );
  }

  function StatCard({ title, value, sub, icon, trend }: { title: string, value: string, sub: string, icon: React.ReactNode, trend?: "up" | "down" }) {
    return (
      <div className="bg-white p-6 border-b-4 border-f1-dark shadow-sm hover:shadow-md transition-shadow group">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-gray-50 text-f1-dark group-hover:bg-f1-red group-hover:text-white transition-colors rounded-lg">
            {icon}
          </div>
          {trend && (
            <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {trend === "up" ? "+12% Growth" : "-4% Delay"}
            </span>
          )}
        </div>
        <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-1">{title}</h4>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-black italic uppercase tracking-tighter">{value}</p>
          <p className="text-[10px] font-bold text-gray-500 uppercase">{sub}</p>
        </div>
      </div>
    );
  }

  function NavPill({ label, active, onClick, index }: { label: string, active: boolean, onClick: () => void, index: number, key?: string | number }) {
    return (
      <button
        onClick={onClick}
        className={`px-10 py-3 text-[10px] font-black uppercase italic tracking-[0.25em] transition-all relative group flex items-center gap-3 ${
          active ? "text-white" : "text-gray-500 hover:text-white"
        }`}
      >
        <div className={`text-[8px] font-mono opacity-50 absolute left-4 top-1/2 -translate-y-1/2 ${active ? 'text-white' : 'group-hover:text-f1-red'}`}>
          S{index + 1}
        </div>
        <span className="relative z-10">{label}</span>
        {active ? (
          <motion.div 
            layoutId="active-nav" 
            className="absolute inset-0 bg-f1-red shadow-[0_0_20px_rgba(225,6,0,0.4)]" 
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        ) : (
          <div className="absolute inset-0 border-r border-gray-800 opacity-50" />
        )}
      </button>
    );
  }

  function renderHome() {
    return (
      <div className="space-y-12 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b-4 border-f1-dark pb-8 gap-10">
          <div className="space-y-1">
            <span className="text-xs font-black text-f1-red uppercase tracking-tighter block mb-2">Research Archive</span>
            <h2 className="text-6xl font-black uppercase italic tracking-tighter leading-none mb-2">
              KLE Technological <br /> University
            </h2>
            <div className="flex gap-4">
              <span className="text-[10px] font-bold text-gray-400 border border-gray-200 px-2 py-0.5 uppercase tracking-widest italic">Hubballi HQ</span>
              <span className="text-[10px] font-bold text-gray-400 border border-gray-200 px-2 py-0.5 uppercase tracking-widest italic">Engineering Specs</span>
            </div>
          </div>

          <div className="flex-1 max-w-xl group">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-f1-red transition-colors" size={20} />
              <input 
                ref={searchRef}
                type="text" 
                placeholder="Search technical database..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border-2 border-f1-dark p-6 pl-16 text-sm font-bold uppercase italic outline-none focus:bg-f1-dark focus:text-white transition-all shadow-[8px_8px_0_0_#15151e] focus:shadow-none"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2">
                <kbd className="px-2 py-1 text-[10px] font-black bg-gray-100 text-gray-500 rounded border border-gray-200 group-focus-within:bg-gray-800 group-focus-within:text-gray-400 group-focus-within:border-gray-700 transition-colors">CMD</kbd>
                <kbd className="px-2 py-1 text-[10px] font-black bg-gray-100 text-gray-500 rounded border border-gray-200 group-focus-within:bg-gray-800 group-focus-within:text-gray-400 group-focus-within:border-gray-700 transition-colors">K</kbd>
              </div>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 text-right italic">
              Accessing global engineering telemetry...
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {filteredBooks.map((book, i) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={book.id}
              className="group cursor-pointer"
            >
              <div className="aspect-[3/4] bg-gray-200 overflow-hidden relative mb-6 shadow-2xl group-hover:-translate-y-2 transition-transform duration-500">
                <img 
                  src={book.imageUrl || `https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400`}
                  alt={book.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-f1-red/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-f1-dark to-transparent">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsEditing(book); }}
                    className="w-full bg-white text-f1-dark py-3 font-black uppercase italic text-xs hover:bg-f1-red hover:text-white transition-colors"
                  >
                    View Details 
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black text-f1-red uppercase tracking-widest">#{book.id} . {book.category}</span>
                  <span className={`text-[10px] font-black uppercase ${book.status === 'Available' ? 'text-green-600' : 'text-f1-red'}`}>
                    {book.status === 'Available' ? 'Ready' : 'In Service'}
                  </span>
                </div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none group-hover:text-f1-red transition-colors">
                  {book.title}
                </h3>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Engineering Spec by {book.author}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  function renderDashboard() {
    return (
      <div className="space-y-10">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Command Center</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2 ml-1">Real-time inventory & operations telemetry</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-f1-red tracking-[0.3em]">Season 2024</p>
            <p className="text-lg font-black italic uppercase">Round 12: Hubballi GP</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Inventory" value="4,821" sub="Volumes" icon={<Library size={24} />} trend="up" />
          <StatCard title="Active Deployments" value="1,202" sub="On Loan" icon={<ArrowUpRight size={24} />} />
          <StatCard title="Member Base" value="8,490" sub="Students" icon={<Users size={24} />} trend="up" />
          <StatCard title="Outstanding Dues" value="₹12.4k" sub="Fines" icon={<Calculator size={24} />} trend="down" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white border-2 border-gray-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                <Clock className="text-f1-red" size={20} />
                Recent Pit Stops <span className="text-[10px] font-bold bg-f1-dark text-white px-2 py-0.5 ml-2">Activity Log</span>
              </h3>
              <button className="text-[10px] font-black uppercase text-f1-blue hover:underline">View Telemetry</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-gray-100">
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Operation</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Target Asset</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Engineer/User</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loans.slice(0, 5).map((loan) => (
                    <tr key={loan.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded ${loan.status === 'Issued' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                            {loan.status === 'Issued' ? <ArrowUpRight size={14} /> : <CheckCircle2 size={14} />}
                          </div>
                          <span className="text-xs font-black uppercase italic italic">{loan.status}</span>
                        </div>
                      </td>
                      <td className="py-4 font-bold text-xs uppercase">{loan.bookTitle}</td>
                      <td className="py-4 font-black uppercase text-[10px] italic">{loan.userName}</td>
                      <td className="py-4">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                          loan.status === 'Overdue' ? 'bg-f1-red text-white' : 'bg-f1-dark text-white'
                        }`}>
                          {loan.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-f1-dark text-white p-8 relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-xl font-black italic uppercase tracking-tighter mb-6">Internal Directive</h3>
              <div className="space-y-6">
                <div className="border-l-2 border-f1-red pl-4 py-1">
                  <p className="text-[10px] font-black uppercase text-f1-red mb-1">System Notice</p>
                  <p className="text-xs font-bold leading-relaxed">Inventory audit scheduled for Section D-3 (Engineering Specimens) this Friday.</p>
                </div>
                <div className="border-l-2 border-f1-blue pl-4 py-1">
                  <p className="text-[10px] font-black uppercase text-f1-blue mb-1">Update Ready</p>
                  <p className="text-xs font-bold leading-relaxed">Version 4.8.2 deployment complete. New fine calculation algorithms active.</p>
                </div>
              </div>
              <button className="mt-10 w-full bg-white text-f1-dark py-3 text-xs font-black uppercase italic hover:bg-f1-red hover:text-white transition-all shadow-xl">
                Open Full Reports
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-1000">
              <ShieldCheck size={200} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderBooks() {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b-4 border-f1-dark pb-6 gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-f1-red uppercase tracking-tighter block">Inventory Management</span>
            <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Books Archive</h2>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search collection..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white border-2 border-transparent border-gray-200 focus:border-f1-dark outline-none pl-10 pr-4 py-2.5 text-xs font-bold transition-all w-64 uppercase tracking-widest"
              />
            </div>
            
            <button 
              onClick={() => setIsAdding(true)}
              className="bg-f1-blue hover:bg-f1-dark text-white px-8 py-3.5 flex items-center gap-2 font-black uppercase italic shadow-lg transition-all"
            >
              <Plus size={18} />
              New Entry
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredBooks.map((book, i) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              key={book.id}
              className="bg-white p-6 shadow-sm border border-gray-100 group flex gap-6"
            >
              <div className="w-24 h-32 flex-shrink-0 relative">
                <img 
                  src={book.imageUrl || `https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=200`}
                  alt="Book Cover"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute -top-2 -left-2 bg-f1-red text-[8px] font-black text-white px-1.5 py-0.5 rounded-sm">#{book.id}</div>
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-black italic uppercase leading-none tracking-tight group-hover:text-f1-red transition-colors mb-1 truncate">
                    {book.title}
                  </h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide truncate">
                    {book.author} • {book.year}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                      book.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {book.status}
                    </span>
                    <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{book.category}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setIsEditing(book)} className="p-2 bg-f1-blue text-white hover:bg-f1-dark transition-colors"><Edit size={12} /></button>
                  <button onClick={() => handleDelete(book.id)} className="p-2 bg-f1-red text-white hover:bg-f1-dark transition-colors"><Trash2 size={12} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  function renderStudents() {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b-4 border-f1-dark pb-6 gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-f1-red uppercase tracking-tighter block">Entity Management</span>
            <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Student Registry</h2>
          </div>
          <button className="bg-f1-dark text-white px-8 py-3.5 flex items-center gap-2 font-black uppercase italic shadow-lg">
            <Plus size={18} /> Add Student
          </button>
        </div>

        <div className="bg-white shadow-sm border border-gray-100">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-6 text-[11px] font-black uppercase tracking-widest text-gray-400">Student Profile</th>
                <th className="p-6 text-[11px] font-black uppercase tracking-widest text-gray-400">Roll/Index</th>
                <th className="p-6 text-[11px] font-black uppercase tracking-widest text-gray-400">Department</th>
                <th className="p-6 text-[11px] font-black uppercase tracking-widest text-gray-400">Status</th>
                <th className="p-6 text-[11px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((student) => (
                <tr key={student.id} className="group hover:bg-gray-50 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-black text-f1-red italic border-2 border-white shadow-md">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black uppercase italic text-sm">{student.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 font-bold text-xs">{student.rollNumber}</td>
                  <td className="p-6 font-black uppercase text-[10px] italic text-f1-blue">{student.department}</td>
                  <td className="p-6">
                    <span className="bg-green-100 text-green-700 text-[10px] font-black uppercase px-2 py-0.5 rounded">Active Driver</span>
                  </td>
                  <td className="p-6 text-right">
                    <button className="p-2 hover:bg-f1-dark hover:text-white transition-all rounded mr-2"><Edit size={14} /></button>
                    <button className="p-2 hover:bg-f1-red hover:text-white transition-all rounded text-f1-red"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function renderEmployees() {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b-4 border-f1-dark pb-6 gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-f1-red uppercase tracking-tighter block">Staff Management</span>
            <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Employee Roster</h2>
          </div>
          <button className="bg-f1-blue text-white px-8 py-3.5 flex items-center gap-2 font-black uppercase italic shadow-lg">
            <Plus size={18} /> New Staff
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {employees.map((emp) => (
            <div key={emp.id} className="bg-white p-8 shadow-sm border-l-8 border-f1-blue flex items-center justify-between group">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-f1-dark text-white flex items-center justify-center font-black text-2xl italic">
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase italic tracking-tighter group-hover:text-f1-blue transition-colors">{emp.name}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{emp.employeeId} • {emp.department}</p>
                  <p className="text-xs font-bold mt-2">{emp.email}</p>
                </div>
              </div>
              <button className="p-4 bg-gray-50 hover:bg-f1-dark hover:text-white transition-all"><Users size={20} /></button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderLoans(statusFiler?: string) {
    const displayLoans = statusFiler ? loans.filter(l => l.status === statusFiler) : loans;
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b-4 border-f1-dark pb-6 gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-f1-red uppercase tracking-tighter block">Lending Telemetry</span>
            <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">{statusFiler ? `${statusFiler} Books` : 'Lending Records'}</h2>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-f1-dark text-white">
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em]">Deployment</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em]">Pilot</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em]">Duration</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em]">Reliability</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayLoans.map((loan) => (
                <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-6">
                    <p className="font-black uppercase italic text-sm">{loan.bookTitle}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">INDEX: {loan.bookId}</p>
                  </td>
                  <td className="p-6">
                    <p className="font-bold text-xs uppercase underline decoration-f1-red underline-offset-4">{loan.userName}</p>
                  </td>
                  <td className="p-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
                        <ArrowUpRight size={12} className="text-blue-500" /> {loan.issueDate}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-f1-red">
                        <ArrowDownLeft size={12} /> {loan.dueDate}
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${
                      loan.status === 'Overdue' ? 'bg-f1-red text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {loan.status}
                    </span>
                  </td>
                  <td className="p-6">
                    <button className="bg-f1-blue text-white text-[10px] font-black px-4 py-2 uppercase italic hover:bg-f1-red transition-colors">Process Return</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function renderFines() {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b-4 border-f1-dark pb-6 gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-f1-red uppercase tracking-tighter block">Financial Penalties</span>
            <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Fine Management</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="bg-f1-red p-8 text-white space-y-4">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">Penalty Rules</h3>
              <ul className="space-y-3 text-xs font-bold uppercase tracking-widest">
                <li className="flex justify-between items-center bg-white/10 p-3">
                  <span>General Collection</span>
                  <span className="font-black italic">₹10 / Day</span>
                </li>
                <li className="flex justify-between items-center bg-white/10 p-3">
                  <span>Reference Specs</span>
                  <span className="font-black italic">₹50 / Day</span>
                </li>
                <li className="flex justify-between items-center bg-white/10 p-3">
                  <span>Resource Damage</span>
                  <span className="font-black italic">Market Price + 20%</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-white p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-black italic uppercase tracking-tighter mb-6">Unpaid Penalties</h3>
            <div className="space-y-4">
              {loans.filter(l => l.fine > 0).map(loan => (
                <div key={loan.id} className="flex justify-between items-center p-4 bg-gray-50 border-r-4 border-f1-red">
                  <div>
                    <p className="font-black uppercase italic text-xs">{loan.userName}</p>
                    <p className="text-[10px] font-bold text-gray-400 truncate w-40">{loan.bookTitle}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-f1-red italic leading-none">₹{loan.fine}</p>
                    <button className="text-[10px] font-black uppercase text-f1-blue hover:underline mt-1">Settle Now</button>
                  </div>
                </div>
              ))}
              <button className="w-full bg-f1-dark text-white py-4 font-black uppercase italic text-sm mt-4 hover:bg-f1-red transition-all">Export All Dues</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderReports() {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b-4 border-f1-dark pb-6 gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-f1-red uppercase tracking-tighter block">Strategic Insights</span>
            <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">System Reports</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 shadow-sm border-t-4 border-f1-dark group">
            <BarChart3 className="text-f1-red mb-4 group-hover:scale-110 transition-transform" size={40} />
            <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2">Inventory Heatmap</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Distribution of technical resources across various engineering departments.</p>
            <button className="mt-6 text-xs font-black uppercase italic text-f1-blue border-b-2 border-f1-blue">Generate PDF</button>
          </div>
          <div className="bg-white p-8 shadow-sm border-t-4 border-f1-dark group">
            <Users className="text-f1-red mb-4 group-hover:scale-110 transition-transform" size={40} />
            <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2">Usage Velocity</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Monthly analysis of book lending frequency and student engagement metrics.</p>
            <button className="mt-6 text-xs font-black uppercase italic text-f1-blue border-b-2 border-f1-blue">Generate XSL</button>
          </div>
          <div className="bg-white p-8 shadow-sm border-t-4 border-f1-dark group">
            <Calculator className="text-f1-red mb-4 group-hover:scale-110 transition-transform" size={40} />
            <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2">Revenue Telemetry</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Fine collection audits and operational budget allocation tracking.</p>
            <button className="mt-6 text-xs font-black uppercase italic text-f1-blue border-b-2 border-f1-blue">Open Ledger</button>
          </div>
        </div>
      </div>
    );
  }

  function renderNotifications() {
    const notifications = [
      { id: 1, title: "System Update", msg: "Library Management System updated to v4.8.2. Check reports for new analytics.", type: "system", time: "2 hours ago" },
      { id: 2, title: "Book Overdue", msg: "Student Priya Patel has 1 book overdue by 6 days. Automated fine applied.", type: "alert", time: "5 hours ago" },
      { id: 3, title: "New Acquisition", msg: "5 copies of 'Advanced Quantum Mechanics' added to Section B-12.", type: "info", time: "Yesterday" },
      { id: 4, title: "Maintenance", msg: "Digital portal will be down for maintenance on Sunday 2:00 AM - 4:00 AM.", type: "warning", time: "2 days ago" },
    ];

    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b-4 border-f1-dark pb-6 gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-f1-red uppercase tracking-tighter block">Communication Hub</span>
            <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Notifications</h2>
          </div>
        </div>

        <div className="max-w-4xl space-y-4">
          {notifications.map((n) => (
            <div key={n.id} className="bg-white p-6 shadow-sm border border-gray-100 flex gap-6 items-start hover:border-f1-red transition-colors">
              <div className={`p-3 rounded-lg ${
                n.type === 'system' ? 'bg-blue-50 text-blue-600' : 
                n.type === 'alert' ? 'bg-red-50 text-red-600' : 
                n.type === 'warning' ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-50 text-gray-600'
              }`}>
                {n.type === 'system' ? <ShieldCheck size={24} /> : 
                 n.type === 'alert' ? <AlertCircle size={24} /> : 
                 n.type === 'warning' ? <Clock size={24} /> : <Bell size={24} />}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-black uppercase italic tracking-tighter">{n.title}</h3>
                  <span className="text-[10px] font-bold text-gray-400 border border-gray-200 px-2 py-0.5 rounded">{n.time}</span>
                </div>
                <p className="text-sm font-bold text-gray-500 italic uppercase tracking-wide">{n.msg}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderBlog() {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b-4 border-f1-dark pb-6 gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-f1-red uppercase tracking-tighter block">Knowledge Stream</span>
            <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Engineering Blog</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {blogPosts.map((post, i) => (
            <motion.a
              key={i}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group flex flex-col md:flex-row gap-6 border-b-2 border-gray-100 pb-8 hover:border-f1-red transition-all"
            >
              <div className="w-full md:w-48 h-48 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                <img src={post.image} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" alt={post.title} />
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-f1-red text-white px-2 py-0.5">{post.category}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{post.date}</span>
                </div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none group-hover:text-f1-red transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Analysis by {post.author}</p>
                <div className="pt-2">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-f1-blue group-hover:translate-x-2 inline-flex items-center gap-2 transition-transform">
                    Read Full Specs <BookOpen size={14} />
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    );
  }

  function renderAbout() {
    return (
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b-4 border-f1-dark pb-6 gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-f1-red uppercase tracking-tighter block">The Institution</span>
            <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">About KLE Library</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none">A Legacy of <br /> Engineering Excellence</h3>
              <p className="text-gray-600 leading-relaxed font-bold italic uppercase text-xs">
                Founded to serve the technical community of North Karnataka, the KLE Technological University Library operates as a precision hub for research and academic growth.
              </p>
              <p className="text-gray-500 text-sm leading-relaxed">
                Our facilities are engineered to provide student and faculty members with rapid access to global technical documentation, journals, and a vast collection of engineering artifacts across all domains including Computer Science, Electronics, and Mechanical Engineering.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 border-t-2 border-f1-dark pt-8">
              <div className="group">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-f1-red mb-2">Established</h4>
                <p className="font-black text-2xl uppercase italic group-hover:text-f1-red transition-colors">1984</p>
              </div>
              <div className="group">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-f1-red mb-2">Units Archived</h4>
                <p className="font-black text-2xl uppercase italic group-hover:text-f1-red transition-colors">150,000+</p>
              </div>
            </div>

            <div className="aspect-video bg-gray-100 overflow-hidden relative group">
              <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" alt="Library Archive" />
              <div className="absolute inset-0 bg-f1-red/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          <div className="space-y-12">
            <div className="bg-f1-dark text-white p-10 space-y-6 relative overflow-hidden">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none relative z-10">Strategic Mission</h3>
              <p className="text-white/70 italic font-bold text-sm leading-relaxed relative z-10">
                "To accelerate the pursuit of knowledge through high-performance research infrastructure and absolute documentation accessibility."
              </p>
              <div className="h-1.5 w-12 bg-f1-red relative z-10"></div>
              <Trophy className="absolute -bottom-10 -right-10 text-white/5" size={200} />
            </div>

            <div className="space-y-6">
              <h4 className="text-xl font-black italic uppercase tracking-tight flex items-center gap-2">
                <ShieldCheck className="text-f1-red" size={20} />
                Governance & Standards
              </h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                Every asset in our collection is categorized according to strict international library standards. We maintain a zero-latency digital catalog system ensuring that no student is ever more than one minute away from the information they require for their engineering missions.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 border-r-4 border-f1-blue">
                  <p className="text-[9px] font-black uppercase text-f1-blue mb-1">Open Access</p>
                  <p className="text-[10px] font-bold uppercase">24/7 Digital Portal</p>
                </div>
                <div className="p-4 bg-gray-50 border-r-4 border-f1-red">
                  <p className="text-[9px] font-black uppercase text-f1-red mb-1">Physical Access</p>
                  <p className="text-[10px] font-bold uppercase">8 AM - 10 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderContact() {
    return (
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b-4 border-f1-dark pb-6 gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-f1-red uppercase tracking-tighter block">Support Network</span>
            <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Contact Station</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-f1-dark text-white p-8 space-y-4">
              <h3 className="text-xl font-black italic uppercase tracking-tighter">Location HQ</h3>
              <p className="text-xs font-bold uppercase italic text-gray-400">Main Campus</p>
              <div className="space-y-1 text-sm font-bold">
                <p>Technological Park</p>
                <p>Vidyanagar, Hubballi</p>
                <p>Karnataka 580031</p>
              </div>
            </div>
            <div className="bg-f1-blue p-8 text-white space-y-4">
              <h3 className="text-xl font-black italic uppercase tracking-tighter">Communications</h3>
              <div className="space-y-4 font-bold uppercase text-[10px] tracking-widest">
                <div className="flex justify-between items-center border-b border-white/20 pb-2">
                  <span>General Support</span>
                  <span>+91 836 237 8300</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/20 pb-2">
                  <span>Library Helpdesk</span>
                  <span>ext: 405</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Email Dispatch</span>
                  <span>library@kle.edu</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border-2 border-gray-100 p-10">
            <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-8">Direct Transmission</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-2">Subject Origin</label>
                  <input className="w-full bg-gray-50 border-2 border-f1-dark p-4 text-xs font-bold uppercase outline-none focus:bg-f1-dark focus:text-white transition-all italic" placeholder="NAME / PILOT ID" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-2">Return Address</label>
                  <input className="w-full bg-gray-50 border-2 border-f1-dark p-4 text-xs font-bold uppercase outline-none focus:bg-f1-dark focus:text-white transition-all italic" placeholder="OFFICIAL EMAIL" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-2">Inquiry Specification</label>
                <textarea rows={6} className="w-full bg-gray-50 border-2 border-f1-dark p-4 text-xs font-bold uppercase outline-none focus:bg-f1-dark focus:text-white transition-all resize-none italic" placeholder="DESCRIBE YOUR TECHNICAL QUERY..."></textarea>
              </div>
              <button className="w-full bg-f1-red text-white py-5 font-black uppercase italic tracking-[0.2em] hover:bg-f1-dark transition-all shadow-xl flex items-center justify-center gap-3">
                Send Transmission <ArrowUpRight size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to retire this book from the collection?")) {
      await fetch(`/api/books/${id}`, { method: "DELETE" });
      setBooks(books.filter(b => b.id !== id));
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const bookData = Object.fromEntries(formData.entries());
    
    if (isEditing) {
      const res = await fetch(`/api/books/${isEditing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });
      const updated = await res.json();
      setBooks(books.map(b => b.id === updated.id ? updated : b));
      setIsEditing(null);
    } else {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...bookData, status: "Available" }),
      });
      const added = await res.json();
      setBooks([...books, added]);
      setIsAdding(false);
    }
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) || 
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      {/* Top Banner */}
      <div className="h-1.5 w-full bg-f1-red z-[70]"></div>

      {/* Header */}
      <header className="bg-f1-dark text-white sticky top-0 z-[60] border-b border-gray-800 shadow-xl">
        <div id="header-inner" className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between border-x border-gray-800/50 bg-gradient-to-b from-white/5 to-transparent">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors md:block hidden"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <button 
                onClick={() => setCurrentView("Home")}
                className="text-2xl font-black italic tracking-tighter uppercase leading-none hover:text-f1-red transition-colors flex items-center gap-2"
              >
                KLE <span className="text-f1-red">LIBRARY</span>
              </button>
            </div>

            {/* Top Navigation Bar - Precision Sector Style */}
            <nav className="hidden xl:flex items-center">
              <div className="flex bg-black/40 border border-gray-800 skew-x-[-15deg] overflow-hidden">
                <div className="flex skew-x-[15deg]">
                  {[
                    { label: "Home", view: "Home" },
                    { label: "Blog", view: "Blog" },
                    { label: "About", view: "About" },
                    { label: "Contact", view: "Contact" }
                  ].map((item, idx) => (
                    <NavPill 
                      key={item.view}
                      index={idx}
                      label={item.label} 
                      active={currentView === item.view} 
                      onClick={() => setCurrentView(item.view as any)} 
                    />
                  ))}
                </div>
              </div>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input 
                type="text" 
                placeholder="Global Search..."
                className="bg-gray-800/50 border border-gray-700 focus:border-f1-red outline-none pl-9 pr-14 py-1.5 text-xs font-bold transition-all w-48 rounded-md focus:w-64 group-focus-within:bg-gray-800 transition-all duration-300"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none transition-opacity group-focus-within:opacity-0">
                <kbd className="px-1 py-0.5 text-[9px] font-black bg-gray-700 text-gray-400 rounded-sm border border-gray-600 font-sans">CMD</kbd>
                <kbd className="px-1 py-0.5 text-[9px] font-black bg-gray-700 text-gray-400 rounded-sm border border-gray-600 font-sans">K</kbd>
              </div>
            </div>
            
            <div className="h-6 w-px bg-gray-800"></div>

            <button 
              onClick={() => setCurrentView("Notifications")}
              className={`relative p-2 rounded-full transition-colors group ${currentView === "Notifications" ? "bg-f1-red text-white" : "hover:bg-gray-800 text-gray-400 hover:text-white"}`}
            >
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-f1-red rounded-full border-2 border-f1-dark"></span>
            </button>

            <button 
              onClick={() => setCurrentView("Contact")}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white"
              title="Assistance"
            >
              <HelpCircle size={20} />
            </button>

            <button 
              onClick={() => setCurrentView("About")}
              className="flex items-center gap-3 pl-4 border-l border-gray-700 group cursor-pointer"
            >
              <div className="text-right hidden md:block">
                <p className="text-xs font-black uppercase italic leading-none group-hover:text-f1-red transition-colors">Anjum Kousar</p>
                <p className="text-[10px] text-f1-red font-bold uppercase tracking-widest mt-1 text-right">System Admin</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-f1-blue border-2 border-f1-red flex items-center justify-center font-black text-sm italic shadow-lg group-hover:scale-110 transition-transform">
                AK
              </div>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar Navigation */}
        <motion.aside 
          initial={false}
          animate={{ width: sidebarOpen ? 280 : 0 }}
          className="bg-f1-dark text-white border-r border-gray-800 overflow-hidden hidden md:block"
        >
          <div className="w-[280px] p-6 space-y-8">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase text-f1-red tracking-[0.3em] px-4 mb-2">Command Center</span>
              <nav className="space-y-1">
                <SidebarItem 
                  icon={<LayoutDashboard size={18} />} 
                  label="Admin Dashboard" 
                  active={currentView === "Dashboard"} 
                  onClick={() => setCurrentView("Dashboard")} 
                />
                <SidebarItem 
                  icon={<Library size={18} />} 
                  label="Inventory Manager" 
                  active={currentView === "Books"} 
                  onClick={() => setCurrentView("Books")} 
                />
                <SidebarItem 
                  icon={<Users size={18} />} 
                  label="Student Registry" 
                  active={currentView === "Students"} 
                  onClick={() => setCurrentView("Students")} 
                />
                <SidebarItem 
                  icon={<UserSquare2 size={18} />} 
                  label="Employee Roster" 
                  active={currentView === "Employees"} 
                  onClick={() => setCurrentView("Employees")} 
                />
              </nav>
            </div>

            <div className="pt-4">
              <span className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] px-4 block mb-4">Lending Operations</span>
              <nav className="space-y-1">
                <SidebarItem 
                  icon={<ArrowUpRight size={18} />} 
                  label="Issued Books" 
                  active={currentView === "Issued"} 
                  onClick={() => setCurrentView("Issued")} 
                />
                <SidebarItem 
                  icon={<CheckCircle2 size={18} />} 
                  label="Returned Books" 
                  active={currentView === "Returned"} 
                  onClick={() => setCurrentView("Returned")} 
                />
                <SidebarItem 
                  icon={<Calculator size={18} />} 
                  label="Fine Management" 
                  active={currentView === "Fines"} 
                  onClick={() => setCurrentView("Fines")} 
                />
              </nav>
            </div>

            <div className="pt-4">
              <span className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] px-4 block mb-4">Analytics & Comms</span>
              <nav className="space-y-1">
                <SidebarItem 
                  icon={<BarChart3 size={18} />} 
                  label="System Reports" 
                  active={currentView === "Reports"} 
                  onClick={() => setCurrentView("Reports")} 
                />
                <SidebarItem 
                  icon={<Bell size={18} />} 
                  label="Notifications" 
                  active={currentView === "Notifications"} 
                  onClick={() => setCurrentView("Notifications")} 
                />
              </nav>
            </div>

            <div className="pt-10">
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-500 hover:text-f1-red transition-colors group">
                <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span>Logout Session</span>
              </button>
            </div>
          </div>
        </motion.aside>

        {/* Main Dashboard Content Area */}
        <main className="flex-1 overflow-x-hidden p-6 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentView === "Home" && renderHome()}
              {currentView === "Dashboard" && renderDashboard()}
              {currentView === "Books" && renderBooks()}
              {currentView === "Students" && renderStudents()}
              {currentView === "Employees" && renderEmployees()}
              {currentView === "Issued" && renderLoans("Issued")}
              {currentView === "Returned" && renderLoans("Returned")}
              {currentView === "Fines" && renderFines()}
              {currentView === "Reports" && renderReports()}
              {currentView === "Notifications" && renderNotifications()}
              {currentView === "Blog" && renderBlog()}
              {currentView === "About" && renderAbout()}
              {currentView === "Contact" && renderContact()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Modal - Formula 1 Style Overlay */}
      <AnimatePresence>
        {(isAdding || isEditing) && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-f1-dark/95 backdrop-blur-sm"
              onClick={() => { setIsAdding(false); setIsEditing(null); }}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, x: 50 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0.9, opacity: 0, x: 50 }}
              className="bg-white w-full max-w-xl relative z-10 overflow-hidden"
            >
              <div className="h-2 w-full bg-f1-red backdrop-blur" />
              <div className="p-10">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter mb-8">
                  {isEditing ? "Modify Specification" : "Entry Registration"}
                </h3>
                
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-500 block mb-1">Book Title</label>
                      <input 
                        name="title" 
                        defaultValue={isEditing?.title}
                        required 
                        className="w-full border-b-2 border-f1-dark text-xl font-bold uppercase italic outline-none focus:border-f1-red transition-colors py-2"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-500 block mb-1">Author / Lead Engineer</label>
                      <input 
                        name="author" 
                        defaultValue={isEditing?.author}
                        required 
                        className="w-full border-b-2 border-f1-dark text-xl font-bold uppercase italic outline-none focus:border-f1-red transition-colors py-2"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-500 block mb-1">ISBN / Index</label>
                        <input 
                          name="isbn" 
                          defaultValue={isEditing?.isbn}
                          required 
                          className="w-full border-b-2 border-f1-dark font-bold outline-none focus:border-f1-red transition-colors py-2"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-500 block mb-1">Category</label>
                        <input 
                          name="category" 
                          defaultValue={isEditing?.category}
                          required 
                          className="w-full border-b-2 border-f1-dark font-bold outline-none focus:border-f1-red transition-colors py-2"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-500 block mb-1">Year</label>
                      <input 
                        name="year" 
                        type="number"
                        defaultValue={isEditing?.year}
                        required 
                        className="w-full border-b-2 border-f1-dark font-bold outline-none focus:border-f1-red transition-colors py-2"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-500 block mb-1">Image URL</label>
                      <input 
                        name="imageUrl" 
                        defaultValue={isEditing?.imageUrl}
                        placeholder="https://example.com/image.jpg"
                        className="w-full border-b-2 border-f1-dark font-bold outline-none focus:border-f1-red transition-colors py-2"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button 
                      type="submit"
                      className="flex-1 bg-f1-blue hover:bg-f1-red text-white py-4 font-black uppercase italic transition-all"
                    >
                      Process Submission
                    </button>
                    <button 
                      type="button"
                      onClick={() => { setIsAdding(false); setIsEditing(null); }}
                      className="px-6 border-2 border-f1-dark font-black uppercase italic hover:bg-gray-100 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Branding - Adjusted to 4 column layout from design UI */}
      <footer className="mt-auto border-t-2 border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-0 text-[10px] font-black uppercase italic tracking-widest text-[#15151e]">
          <div className="py-6 border-r border-gray-200">Total Volumes: 4,821</div>
          <div className="py-6 md:border-r border-gray-200 pl-4 md:pl-8">Active Loans: 1,202</div>
          <div className="py-6 border-r border-gray-200 pl-4 md:pl-8">Waitlist: 42</div>
          <div className="py-6 pl-4 md:pl-8">Last Sync: {new Date().toLocaleTimeString()}</div>
        </div>
        <div className="bg-[#15151e] text-white py-4 px-8 border-t border-gray-800">
          <div className="max-w-7xl mx-auto flex justify-between items-center opacity-50">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">© KLE LIBRARY DATA SYSTEMS 2024</span>
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-f1-red">Visual Identity by Outfit</span>
            </div>
            <div className="flex gap-6 text-[10px] font-bold uppercase tracking-wider">
              <span>Regulation</span>
              <span>Privacy</span>
              <span>Cookies</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
