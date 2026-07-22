import React, { useState } from 'react';
import { useWedding } from '../context/WeddingContext';
import { formatDate } from '../utils/formatters';
import {
  CheckSquare,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Circle,
  Clock
} from 'lucide-react';

const CATEGORIES = ['All', 'Venue', 'Vendors', 'Catering', 'Guests', 'Decoration', 'Attire', 'Ceremony'];

export const Checklist = () => {
  const { checklist, toggleChecklistTask, addChecklistTask, deleteChecklistTask } = useWedding();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Venue');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  const completedCount = checklist.filter(t => t.completed).length;
  const totalCount = checklist.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredTasks = checklist.filter(t => {
    return selectedCategory === 'All' || t.category === selectedCategory;
  });

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    addChecklistTask({
      task: newTaskText,
      category: newTaskCategory,
      dueDate: newTaskDueDate || new Date().toISOString().split('T')[0]
    });

    setNewTaskText('');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
          <CheckSquare className="w-7 h-7 text-amber-500" />
          Wedding Planning Checklist
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Stay on schedule with your wedding milestones, vendor bookings, and ceremony preparations.
        </p>
      </div>

      {/* Progress Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/50 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Checklist Progress</span>
            <h3 className="font-serif-heading text-xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">
              {completedCount} of {totalCount} Tasks Completed
            </h3>
          </div>
          <span className="text-2xl font-extrabold font-serif-heading text-amber-600">
            {progressPercent}%
          </span>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Quick Task Add Form */}
      <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/50 dark:border-slate-800 shadow-xs">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add a new wedding checklist task..."
          className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
        />

        <select
          value={newTaskCategory}
          onChange={(e) => setNewTaskCategory(e.target.value)}
          className="px-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none"
        >
          {CATEGORIES.filter(c => c !== 'All').map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <input
          type="date"
          value={newTaskDueDate}
          onChange={(e) => setNewTaskDueDate(e.target.value)}
          className="px-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none"
        />

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold text-xs shadow-md transition-all shrink-0 flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </form>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-amber-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-amber-100 dark:border-slate-800">
            <p className="text-xs text-slate-400">No tasks found in this category.</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all ${
                task.completed ? 'border-emerald-200/60 dark:border-emerald-950 opacity-75' : 'border-amber-200/50 dark:border-slate-800 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <button
                  onClick={() => toggleChecklistTask(task.id)}
                  className="text-amber-500 hover:scale-110 transition-transform"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-300 hover:text-amber-500" />
                  )}
                </button>

                <div>
                  <h4 className={`text-sm font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>
                    {task.task}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      {task.category}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Due {formatDate(task.dueDate)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => deleteChecklistTask(task.id)}
                className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
