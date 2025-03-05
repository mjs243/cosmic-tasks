'use client';

import { useState, useEffect } from 'react';
import { SpaceBackground } from '@/components/cosmic/space-background';
import { useTheme } from '@/context/theme-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Sun, Moon, Check, Star, MoreHorizontal } from 'lucide-react';
import { pb } from '@/lib/pocketbase';

// Sample task type
interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: number; // 1 = low, 2 = medium, 3 = high
}

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', text: 'Design space-themed UI', completed: false, priority: 3 },
    { id: '2', text: 'Set up PocketBase schema', completed: false, priority: 2 },
    { id: '3', text: 'Implement drag and drop', completed: false, priority: 1 },
    { id: '4', text: 'Create authentication flow', completed: false, priority: 2 },
    { id: '5', text: 'Add keyboard shortcuts', completed: true, priority: 1 },
  ]);
  const [newTaskText, setNewTaskText] = useState('');
  const darkMode = theme === 'dark';

  const addTask = () => {
    if (newTaskText.trim()) {
      const newTask = {
        id: Date.now().toString(),
        text: newTaskText,
        completed: false,
        priority: 2 // default priority
      };
      setTasks([...tasks, newTask]);
      setNewTaskText('');
    }
  };

  const toggleComplete = (id: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  return (
    <div className={`min-h-screen w-full flex flex-col items-center p-6 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <SpaceBackground darkMode={darkMode} />
      
      <div className="w-full max-w-2xl z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Cosmic Task Orbit</h1>
          <Button 
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </div>
        
        {/* New task input */}
        <div className={`flex mb-6 p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
          <Input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a new cosmic task..."
            className={`flex-1 mr-2 ${darkMode ? 'bg-gray-700 text-white placeholder:text-gray-400' : 'bg-gray-100 text-gray-800 placeholder:text-gray-500'}`}
          />
          <Button onClick={addTask}>
            <Plus size={20} />
          </Button>
        </div>
        
        {/* Priority legend */}
        <div className="flex gap-4 mb-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
            <span>High Orbit</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
            <span>Medium Orbit</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span>Low Orbit</span>
          </div>
        </div>
        
        {/* Tasks list */}
        <div className="space-y-3">
          {tasks.map(task => (
            <div 
              key={task.id}
              className={`
                p-4 rounded-lg flex items-center justify-between
                transition-all duration-300 transform
                ${task.completed ? 'opacity-60 scale-[0.98]' : 'opacity-100'}
                ${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50 shadow-md'}
                ${task.priority === 3 ? 'border-l-4 border-red-500' : 
                  task.priority === 2 ? 'border-l-4 border-yellow-500' : 
                  'border-l-4 border-green-500'}
              `}
              style={{
                transform: `translateX(${task.priority * 8}px)`,
              }}
              draggable="true"
            >
              <div className="flex items-center">
                <button 
                  onClick={() => toggleComplete(task.id)}
                  className={`
                    w-6 h-6 rounded-full mr-3 flex items-center justify-center
                    ${task.completed ? 
                      (darkMode ? 'bg-indigo-600' : 'bg-indigo-500') : 
                      (darkMode ? 'border-2 border-gray-600' : 'border-2 border-gray-300')}
                  `}
                >
                  {task.completed && <Check size={14} className="text-white" />}
                </button>
                <span className={task.completed ? 'line-through' : ''}>{task.text}</span>
              </div>
              <div className="flex items-center">
                {task.priority === 3 && (
                  <Star size={16} className="text-red-500 mr-2" fill="currentColor" />
                )}
                <button className="text-gray-400 hover:text-gray-300">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Keyboard shortcut hint */}
        <div className="mt-8 text-center opacity-70 text-sm">
          <span className={`px-2 py-1 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>Enter</span>
          <span className="ml-2">Add new task</span>
        </div>
      </div>
    </div>
  );
}