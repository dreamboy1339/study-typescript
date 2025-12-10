import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { LessonContent } from './components/LessonContent';
import { CodeEditor } from './components/CodeEditor';
import { ProgressPage } from './components/ProgressPage';
import { lessons } from './data/lessons';

export default function App() {
  const [currentLessonId, setCurrentLessonId] = useState(1);
  const [currentPage, setCurrentPage] = useState<'lesson' | 'progress'>('lesson');
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  
  const currentLesson = lessons.find(lesson => lesson.id === currentLessonId);

  // 로컬 스토리지에서 진행 상황 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('completedLessons');
    if (saved) {
      setCompletedLessons(new Set(JSON.parse(saved)));
    }
  }, []);

  // 레슨 완료 처리
  const markLessonComplete = (lessonId: number) => {
    const newCompleted = new Set(completedLessons);
    newCompleted.add(lessonId);
    setCompletedLessons(newCompleted);
    localStorage.setItem('completedLessons', JSON.stringify(Array.from(newCompleted)));
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <div className="flex flex-1 overflow-hidden">
        {currentPage === 'lesson' && (
          <>
            <Sidebar 
              lessons={lessons}
              currentLessonId={currentLessonId}
              onLessonSelect={setCurrentLessonId}
              completedLessons={completedLessons}
            />
            
            <main className="flex-1 overflow-hidden flex flex-col">
              {currentLesson && (
                <>
                  <div className="flex-1 overflow-y-auto">
                    <div className="max-w-5xl mx-auto p-8 pb-24">
                      <LessonContent lesson={currentLesson} />
                    </div>
                  </div>
                  
                  <CodeEditor 
                    initialCode={currentLesson.example} 
                    onComplete={() => markLessonComplete(currentLessonId)}
                  />
                </>
              )}
            </main>
          </>
        )}
        
        {currentPage === 'progress' && (
          <ProgressPage 
            lessons={lessons}
            completedLessons={completedLessons}
            onLessonSelect={setCurrentLessonId}
            onNavigateToLesson={() => setCurrentPage('lesson')}
          />
        )}
      </div>
      
      <Footer />
    </div>
  );
}
