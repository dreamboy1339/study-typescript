import { Book, CheckCircle } from 'lucide-react';
import { Lesson } from '../data/lessons';

interface SidebarProps {
  lessons: Lesson[];
  currentLessonId: number;
  onLessonSelect: (id: number) => void;
  completedLessons: Set<number>;
}

export function Sidebar({ lessons, currentLessonId, onLessonSelect, completedLessons }: SidebarProps) {
  const categories = Array.from(new Set(lessons.map(l => l.category)));

  return (
    <aside className="w-80 bg-white/80 backdrop-blur-sm border-r border-gray-200/50 overflow-y-auto shadow-sm">
      <div className="p-6 border-b border-gray-200/50 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
            <Book className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-gray-900">학습 목차</h2>
            <p className="text-gray-600">단계별로 학습하세요</p>
          </div>
        </div>
      </div>

      <nav className="p-4">
        {categories.map(category => (
          <div key={category} className="mb-6">
            <h3 className="px-3 mb-3 text-gray-600 uppercase tracking-wider">
              {category}
            </h3>
            <ul className="space-y-2">
              {lessons
                .filter(lesson => lesson.category === category)
                .map(lesson => {
                  const isCompleted = completedLessons.has(lesson.id);
                  return (
                    <li key={lesson.id}>
                      <button
                        onClick={() => onLessonSelect(lesson.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 relative ${
                          currentLessonId === lesson.id
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md transform scale-[1.02]'
                            : 'text-gray-700 hover:bg-gray-100/80 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                            currentLessonId === lesson.id
                              ? 'bg-white/20 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {lesson.id}
                          </span>
                          <span className="flex-1">{lesson.title}</span>
                          {isCompleted && (
                            <CheckCircle className={`w-5 h-5 flex-shrink-0 ${
                              currentLessonId === lesson.id
                                ? 'text-green-300'
                                : 'text-green-500'
                            }`} />
                          )}
                        </div>
                      </button>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
