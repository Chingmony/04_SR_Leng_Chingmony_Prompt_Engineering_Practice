"use client"
import { useState } from 'react';
import { X, Plus, Edit2, Trash2, Eye, Check } from 'lucide-react';

export default function TodoApp() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Review Q4 Financial Reports',
      description: 'Analyze revenue trends, expense ratios, and prepare summary for stakeholder meeting.',
      completed: false,
      createdAt: new Date('2024-10-01T09:00:00').toISOString()
    },
    {
      id: 2,
      title: 'Update Product Documentation',
      description: 'Revise user guides and API documentation to reflect recent feature releases.',
      completed: true,
      createdAt: new Date('2024-10-02T14:30:00').toISOString()
    },
    {
      id: 3,
      title: 'Client Meeting Preparation',
      description: 'Prepare presentation slides and project timeline for upcoming client review meeting.',
      completed: false,
      createdAt: new Date('2024-10-03T11:00:00').toISOString()
    },
    {
      id: 4,
      title: 'Code Review - Authentication Module',
      description: 'Review pull request #247 for the new OAuth implementation and provide feedback.',
      completed: false,
      createdAt: new Date('2024-10-04T16:00:00').toISOString()
    },
    {
      id: 5,
      title: 'Team Performance Reviews',
      description: 'Complete quarterly performance evaluations for direct reports.',
      completed: true,
      createdAt: new Date('2024-09-28T10:00:00').toISOString()
    }
  ]);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '' });

  const addTask = () => {
    if (!formData.title.trim()) return;
    
    if (editingTask) {
      setTasks(tasks.map(task => 
        task.id === editingTask.id 
          ? { ...task, title: formData.title, description: formData.description }
          : task
      ));
      setEditingTask(null);
    } else {
      const newTask = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTasks([...tasks, newTask]);
    }
    
    setFormData({ title: '', description: '' });
    setIsModalOpen(false);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    setIsDeleteConfirmOpen(false);
    setTaskToDelete(null);
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({ title: task.title, description: task.description });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingTask(null);
    setFormData({ title: '', description: '' });
    setIsModalOpen(true);
  };

  const openDetailModal = (task) => {
    setViewingTask(task);
    setIsDetailModalOpen(true);
  };

  const openDeleteConfirm = (task) => {
    setTaskToDelete(task);
    setIsDeleteConfirmOpen(true);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 border-b border-slate-200 pb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Task Manager
            </h1>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
            >
              <Plus size={20} />
              New Task
            </button>
          </div>
          <p className="text-slate-600">Manage your tasks and projects efficiently</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-6 mb-6">
          <span className="text-sm font-medium text-slate-700">Filter:</span>
          <div className="flex gap-2">
            {['all', 'active', 'completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="ml-auto text-sm text-slate-500">
            <span className="font-medium text-slate-700">{tasks.filter(t => !t.completed).length}</span> active · <span className="font-medium text-slate-700">{tasks.filter(t => t.completed).length}</span> completed
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-200 shadow-sm">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-slate-300 mb-3">
                <Check size={64} className="mx-auto" />
              </div>
              <p className="text-slate-500 text-lg font-medium mb-1">
                {filter === 'completed' ? 'No completed tasks' : 
                 filter === 'active' ? 'No active tasks' : 
                 'No tasks found'}
              </p>
              <p className="text-slate-400 text-sm">
                {filter === 'all' && 'Create a new task to get started'}
              </p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                className={`p-5 hover:bg-slate-50 transition-colors ${
                  task.completed ? 'bg-slate-50/50' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleComplete(task.id)}
                    className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                      task.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {task.completed && <Check size={14} className="text-white" strokeWidth={3} />}
                  </button>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-slate-900 mb-1.5 ${
                      task.completed ? 'line-through text-slate-500' : ''
                    }`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className={`text-sm line-clamp-2 ${
                        task.completed ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {task.description}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => openDetailModal(task)}
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                      title="View details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => openEditModal(task)}
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                      title="Edit task"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => openDeleteConfirm(task)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete task"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl transform transition-all">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter task title"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add more details (optional)"
                  rows="4"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={addTask}
                  disabled={!formData.title.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingTask ? 'Save Changes' : 'Add Task'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && viewingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-slate-800 pr-8">
                {viewingTask.title}
              </h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  viewingTask.completed
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {viewingTask.completed ? 'Completed' : 'Active'}
                </span>
              </div>

              {viewingTask.description && (
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-2">Description</h3>
                  <p className="text-slate-600 whitespace-pre-wrap">
                    {viewingTask.description}
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-2">Created</h3>
                <p className="text-slate-600">
                  {new Date(viewingTask.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium mt-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && taskToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Delete Task?
            </h2>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete "{taskToDelete.title}"? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteTask(taskToDelete.id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}