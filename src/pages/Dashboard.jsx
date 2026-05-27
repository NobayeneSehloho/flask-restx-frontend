import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService, studentService, departmentService, teacherService, enrolmentService, studentEnrolmentService } from '../services/data';
import Layout from '../components/layout/Layout';
import toast from 'react-hot-toast';

const cards = [
  { key: 'departments', label: 'Departments', link: '/departments', bg: 'from-purple-500 to-purple-700', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { key: 'courses', label: 'Courses', link: '/courses', bg: 'from-blue-500 to-blue-700', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { key: 'teachers', label: 'Teachers', link: '/teachers', bg: 'from-amber-500 to-orange-600', icon: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { key: 'students', label: 'Students', link: '/students', bg: 'from-green-500 to-emerald-700', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { key: 'enrolments', label: 'Teacher Enrolments', link: '/enrolments', bg: 'from-indigo-500 to-indigo-700', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { key: 'studentEnrolments', label: 'Student Enrolments', link: '/student-enrolments', bg: 'from-pink-500 to-rose-600', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
];

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      const [deptRes, courseRes, teacherRes, studentRes, enrolRes, stuEnrolRes] = await Promise.all([
        departmentService.getAll(),
        courseService.getAll(),
        teacherService.getAll(),
        studentService.getAll(),
        enrolmentService.getAll(),
        studentEnrolmentService.getAll(),
      ]);
      setStats({
        departments: deptRes.data.length,
        courses: courseRes.data.length,
        teachers: teacherRes.data.length,
        students: studentRes.data.length,
        enrolments: enrolRes.data.length,
        studentEnrolments: stuEnrolRes.data.length,
      });
    } catch { toast.error('Failed to load statistics'); }
    finally { setLoading(false); }
  };

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Overview of your course management system</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.key}
              to={card.link}
              className={`bg-gradient-to-br ${card.bg} rounded-xl shadow-lg p-6 text-white transform transition-all duration-200 hover:scale-105 hover:shadow-2xl`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/80">{card.label}</p>
                  <p className="mt-2 text-4xl font-bold">
                    {loading ? (
                      <span className="inline-block w-12 h-9 bg-white/20 rounded animate-pulse" />
                    ) : stats[card.key]}
                  </p>
                </div>
                <div className="bg-white/20 rounded-full p-3">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={card.icon} />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-white/70">
                <span>View all →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
