import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { courseService, departmentService } from '../services/data';
import toast from 'react-hot-toast';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({ name: '', department_id: '' });
  const [expandedId, setExpandedId] = useState(null);
  const [relatedData, setRelatedData] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [courseRes, deptRes] = await Promise.all([courseService.getAll(), departmentService.getAll()]);
      setCourses(courseRes.data);
      setDepartments(deptRes.data);
    } catch { toast.error('Failed to load courses'); }
    finally { setLoading(false); }
  };

  const toggleExpand = async (id) => {
    if (expandedId === id) { setExpandedId(null); return; }
    setExpandedId(id);
    setLoadingRelated(true);
    try {
      const res = await courseService.getStudents(id);
      setRelatedData(res.data);
    } catch { setRelatedData([]); }
    finally { setLoadingRelated(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { name: formData.name, department_id: Number(formData.department_id) };
      if (editingCourse) { await courseService.update(editingCourse.id, payload); toast.success('Course updated'); }
      else { await courseService.create(payload); toast.success('Course created'); }
      closeModal();
      loadData();
    } catch { toast.error('Operation failed'); }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({ name: course.name, department_id: course.department_id || '' });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try { await courseService.delete(id); toast.success('Course deleted'); loadData(); }
      catch { toast.error('Failed to delete course'); }
    }
  };

  const closeModal = () => { setIsModalOpen(false); setEditingCourse(null); setFormData({ name: '', department_id: '' }); };

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
          <Button onClick={() => setIsModalOpen(true)}>Add New Course</Button>
        </div>

        {loading ? <div className="text-center py-12">Loading...</div> : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course) => (
                  <>
                    <tr key={course.id} className="cursor-pointer hover:bg-gray-50" onClick={() => toggleExpand(course.id)}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <span className="mr-2 text-gray-400">{expandedId === course.id ? '▼' : '▶'}</span>
                        {course.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.department_name || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => handleEdit(course)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                        <button onClick={() => handleDelete(course.id)} className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                    {expandedId === course.id && (
                      <tr key={`${course.id}-detail`}>
                        <td colSpan="4" className="px-8 py-4 bg-blue-50">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Enrolled Students</p>
                          {loadingRelated ? <p className="text-sm text-gray-500">Loading...</p> :
                            relatedData.length === 0 ? <p className="text-sm text-gray-500 italic">No students enrolled</p> : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {relatedData.map((s) => (
                                  <div key={s.id} className="bg-white rounded px-3 py-2 text-sm shadow-sm">
                                    <span className="font-medium">{s.name}</span> <span className="text-gray-400">— {s.email}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Modal isOpen={isModalOpen} onClose={closeModal} title={editingCourse ? 'Edit Course' : 'Add New Course'}>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Name</label>
              <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" value={formData.department_id} onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}>
                <option value="">Select a department</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
              <Button type="submit">{editingCourse ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
}
