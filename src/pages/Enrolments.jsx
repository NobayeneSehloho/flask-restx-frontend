import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { enrolmentService, teacherService, courseService } from '../services/data';
import toast from 'react-hot-toast';

export default function Enrolments() {
  const [enrolments, setEnrolments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ teacher_id: '', course_id: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [enrolRes, teacherRes, courseRes] = await Promise.all([
        enrolmentService.getAll(),
        teacherService.getAll(),
        courseService.getAll(),
      ]);
      setEnrolments(enrolRes.data);
      setTeachers(teacherRes.data);
      setCourses(courseRes.data);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await enrolmentService.create({ teacher_id: Number(formData.teacher_id), course_id: Number(formData.course_id) });
      toast.success('Enrolment created');
      setIsModalOpen(false);
      setFormData({ teacher_id: '', course_id: '' });
      loadData();
    } catch { toast.error('Operation failed'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this enrolment?')) {
      try {
        await enrolmentService.delete(id);
        toast.success('Enrolment removed');
        loadData();
      } catch { toast.error('Failed to delete enrolment'); }
    }
  };

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Enrolments (Teacher → Course)</h1>
          <Button onClick={() => setIsModalOpen(true)}>Assign Teacher</Button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enrolments.map((e) => (
                  <tr key={e.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{e.teacher_name}</td>
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

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Assign Teacher to Course">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Teacher</label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.teacher_id}
                onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
              >
                <option value="">Select a teacher</option>
                {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
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
              <Button type="submit">Assign</Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
}
