import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { departmentService } from '../services/data';
import toast from 'react-hot-toast';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [expandedId, setExpandedId] = useState(null);
  const [relatedData, setRelatedData] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => { loadDepartments(); }, []);

  const loadDepartments = async () => {
    try { const res = await departmentService.getAll(); setDepartments(res.data); }
    catch { toast.error('Failed to load departments'); }
    finally { setLoading(false); }
  };

  const toggleExpand = async (id) => {
    if (expandedId === id) { setExpandedId(null); return; }
    setExpandedId(id);
    setLoadingRelated(true);
    try { const res = await departmentService.getCourses(id); setRelatedData(res.data); }
    catch { setRelatedData([]); }
    finally { setLoadingRelated(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDepartment) { await departmentService.update(editingDepartment.id, formData); toast.success('Department updated'); }
      else { await departmentService.create(formData); toast.success('Department created'); }
      closeModal();
      loadDepartments();
    } catch { toast.error('Operation failed'); }
  };

  const handleEdit = (dept) => {
    setEditingDepartment(dept);
    setFormData({ name: dept.name });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this department?')) {
      try { await departmentService.delete(id); toast.success('Department deleted'); loadDepartments(); }
      catch { toast.error('Failed to delete department'); }
    }
  };

  const closeModal = () => { setIsModalOpen(false); setEditingDepartment(null); setFormData({ name: '' }); };

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
          <Button onClick={() => setIsModalOpen(true)}>Add Department</Button>
        </div>

        {loading ? <div className="text-center py-12">Loading...</div> : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {departments.map((dept) => (
                  <>
                    <tr key={dept.id} className="cursor-pointer hover:bg-gray-50" onClick={() => toggleExpand(dept.id)}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <span className="mr-2 text-gray-400">{expandedId === dept.id ? '▼' : '▶'}</span>
                        {dept.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => handleEdit(dept)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                        <button onClick={() => handleDelete(dept.id)} className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                    {expandedId === dept.id && (
                      <tr key={`${dept.id}-detail`}>
                        <td colSpan="3" className="px-8 py-4 bg-purple-50">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Courses in this Department</p>
                          {loadingRelated ? <p className="text-sm text-gray-500">Loading...</p> :
                            relatedData.length === 0 ? <p className="text-sm text-gray-500 italic">No courses in this department</p> : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {relatedData.map((c) => (
                                  <div key={c.id} className="bg-white rounded px-3 py-2 text-sm shadow-sm">
                                    <span className="font-medium">{c.name}</span>
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

        <Modal isOpen={isModalOpen} onClose={closeModal} title={editingDepartment ? 'Edit Department' : 'Add Department'}>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Department Name</label>
              <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
              <Button type="submit">{editingDepartment ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
}
