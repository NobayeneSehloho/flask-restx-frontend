import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { studentEnrolmentService, studentService, courseService } from '../services/data';
import toast from 'react-hot-toast';

export default function StudentEnrolments() {
  const [enrolments, setEnrolments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ student_id: '', course_id: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [enrolRes, studentRes, courseRes] = await Promise.all([
        studentEnrolmentService.getAll(),
        studentService.getAll(),
        courseService.getAll(),
      ]);
      setEnrolments(enrolRes.data);
      setStudents(studentRes.data);
      setCourses(courseRes.data);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await studentEnrolmentService.create({ student_id: Number(formData.student_id), course_id: Number(formData.course_id) });
      toast.success('Student enrolled');
      setIsModalOpen(false);
      setFormData({ student_id: '', course_id: '' });
      loadData();
    } catch { toast.error('Operation failed'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this enrolment?')) {
      try {
        await studentEnrolmentService.delete(id);
        toast.success('Enrolment removed');
        loadData();
      } catch { toast.error('Failed to delete enrolment'); }
    }
  };

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Student Enrolments (Student → Course)</h1>
          <Button onClick={() => setIsModalOpen(true)}>Enrol Student</Button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enrolments.map((e) => (
                  <tr key={e.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{e.student_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{e.course_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{e.enrolled_at ? new Date(e.enrolled_at).toLocaleDateString() : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{e.status || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleDelete(e.id)} className="text-red-600 hover:text-red-900">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Enrol Student in Course">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.student_id}
                onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
              >
                <option value="">Select a student</option>
                {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.course_id}
                onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
              >
                <option value="">Select a course</option>
                {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit">Enrol</Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
}
