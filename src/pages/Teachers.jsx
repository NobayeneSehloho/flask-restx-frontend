import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { teacherService } from '../services/data';
import toast from 'react-hot-toast';

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [expandedId, setExpandedId] = useState(null);
  const [relatedData, setRelatedData] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => { loadTeachers(); }, []);

  const loadTeachers = async () => {
    try { const res = await teacherService.getAll(); setTeachers(res.data); }
    catch { toast.error('Failed to load teachers'); }
    finally { setLoading(false); }
  };

  const toggleExpand = async (id) => {
    if (expandedId === id) { setExpandedId(null); return; }
    setExpandedId(id);
    setLoadingRelated(true);
    try { const res = await teacherService.getCourses(id); setRelatedData(res.data); }
    catch { setRelatedData([]); }
    finally { setLoadingRelated(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTeacher) { await teacherService.update(editingTeacher.id, formData); toast.success('Teacher updated'); }
      else { await teacherService.create(formData); toast.success('Teacher created'); }
      closeModal();
      loadTeachers();
    } catch { toast.error('Operation failed'); }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({ name: teacher.name, email: teacher.email });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this teacher?')) {
      try { await teacherService.delete(id); toast.success('Teacher deleted'); loadTeachers(); }
      catch { toast.error('Failed to delete teacher'); }
    }
  };

  const closeModal = () => { setIsModalOpen(false); setEditingTeacher(null); setFormData({ name: '', email: '' }); };

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
          <Button onClick={() => setIsModalOpen(true)}>Add Teacher</Button>
        </div>

        {loading ? <div className="text-center py-12">Loading...</div> : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teachers.map((teacher) => (
                  <>
                    <tr key={teacher.id} className="cursor-pointer hover:bg-gray-50" onClick={() => toggleExpand(teacher.id)}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <span className="mr-2 text-gray-400">{expandedId === teacher.id ? '▼' : '▶'}</span>
                        {teacher.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => handleEdit(teacher)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                        <button onClick={() => handleDelete(teacher.id)} className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                    {expandedId === teacher.id && (
                      <tr key={`${teacher.id}-detail`}>
                        <td colSpan="4" className="px-8 py-4 bg-amber-50">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Assigned Courses</p>
                          {loadingRelated ? <p className="text-sm text-gray-500">Loading...</p> :
                            relatedData.length === 0 ? <p className="text-sm text-gray-500 italic">No courses assigned</p> : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {relatedData.map((c) => (
                                  <div key={c.id} className="bg-white rounded px-3 py-2 text-sm shadow-sm">
                                    <span className="font-medium">{c.name}</span> <span className="text-gray-400">— {c.department_name || 'No dept'}</span>
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

        <Modal isOpen={isModalOpen} onClose={closeModal} title={editingTeacher ? 'Edit Teacher' : 'Add Teacher'}>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
              <Button type="submit">{editingTeacher ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
}
