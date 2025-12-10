import { Trophy, Target, CheckCircle, Clock, TrendingUp, Award, BookOpen } from 'lucide-react';
import { Lesson } from '../data/lessons';

interface ProgressPageProps {
  lessons: Lesson[];
  completedLessons: Set<number>;
  onLessonSelect: (id: number) => void;
  onNavigateToLesson: () => void;
}

export function ProgressPage({ lessons, completedLessons, onLessonSelect, onNavigateToLesson }: ProgressPageProps) {
  const totalLessons = lessons.length;
  const completedCount = completedLessons.size;
  const progressPercentage = Math.round((completedCount / totalLessons) * 100);
  
  const categories = Array.from(new Set(lessons.map(l => l.category)));
  
  const getCategoryProgress = (category: string) => {
    const categoryLessons = lessons.filter(l => l.category === category);
    const completedInCategory = categoryLessons.filter(l => completedLessons.has(l.id)).length;
    return {
      total: categoryLessons.length,
      completed: completedInCategory,
      percentage: Math.round((completedInCategory / categoryLessons.length) * 100)
    };
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">학습 진행 상황</h1>
          <p className="text-gray-600">
            당신의 TypeScript 학습 여정을 확인하세요
          </p>
        </div>

        {/* 전체 진행률 카드 */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 mb-8 text-white shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white mb-2">전체 진행률</h2>
              <p className="text-blue-100">
                {completedCount}개 / {totalLessons}개 레슨 완료
              </p>
            </div>
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-yellow-300" />
            </div>
          </div>
          
          <div className="relative h-4 bg-white/20 rounded-full overflow-hidden mb-2">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-right text-blue-100">{progressPercentage}%</p>
        </div>

        {/* 통계 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600">완료한 레슨</p>
                <p className="text-gray-900">{completedCount}개</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600">남은 레슨</p>
                <p className="text-gray-900">{totalLessons - completedCount}개</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600">학습 진행률</p>
                <p className="text-gray-900">{progressPercentage}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* 카테고리별 진행 상황 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-gray-200/50 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-6 h-6 text-blue-600" />
            <h2 className="text-gray-900">카테고리별 진행 상황</h2>
          </div>
          
          <div className="space-y-6">
            {categories.map(category => {
              const progress = getCategoryProgress(category);
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">{category}</span>
                    <span className="text-gray-600">
                      {progress.completed} / {progress.total}
                    </span>
                  </div>
                  <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                      style={{ width: `${progress.percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 레슨 목록 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-gray-200/50">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h2 className="text-gray-900">레슨 목록</h2>
          </div>
          
          <div className="space-y-3">
            {lessons.map(lesson => {
              const isCompleted = completedLessons.has(lesson.id);
              return (
                <button
                  key={lesson.id}
                  onClick={() => {
                    onLessonSelect(lesson.id);
                    onNavigateToLesson();
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-left"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCompleted 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Clock className="w-6 h-6" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        isCompleted 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {lesson.category}
                      </span>
                      <h3 className="text-gray-900">{lesson.title}</h3>
                    </div>
                    <p className="text-gray-600">{lesson.description}</p>
                  </div>
                  
                  {isCompleted && (
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full">
                        <CheckCircle className="w-4 h-4" />
                        <span>완료</span>
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
