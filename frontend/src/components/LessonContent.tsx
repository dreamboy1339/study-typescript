import { BookOpen, Lightbulb, Sparkles } from 'lucide-react';
import { Lesson } from '../data/lessons';

interface LessonContentProps {
  lesson: Lesson;
}

export function LessonContent({ lesson }: LessonContentProps) {
  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-gray-200/50">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full mb-4">
          <Sparkles className="w-4 h-4" />
          <span>{lesson.category}</span>
        </div>
        <h2 className="text-gray-900 mb-3">{lesson.title}</h2>
        <p className="text-gray-600 leading-relaxed text-lg">
          {lesson.description}
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 p-8 rounded-2xl shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="space-y-4 flex-1">
            {lesson.content.map((paragraph, index) => (
              <p key={index} className="text-gray-800 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      {lesson.points && lesson.points.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/50 p-8 rounded-2xl shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="mb-4 text-amber-900">주요 포인트</h3>
              <ul className="space-y-3">
                {lesson.points.map((point, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-800">
                    <span className="w-6 h-6 bg-amber-200 text-amber-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-200/50">
        <h3 className="mb-2 text-gray-900">💻 실습해보기</h3>
        <p className="text-gray-600 leading-relaxed">
          아래 에디터에서 코드를 직접 수정하고 &quot;실행&quot; 버튼을 눌러 결과를 확인해보세요.
        </p>
      </div>
    </div>
  );
}
