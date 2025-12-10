import { Code2, Github, BookOpen, TrendingUp } from 'lucide-react';

interface HeaderProps {
  currentPage: 'lesson' | 'progress';
  onPageChange: (page: 'lesson' | 'progress') => void;
}

export function Header({ currentPage, onPageChange }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-full px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900">TypeScript Academy</h1>
                <p className="text-gray-500">쉽고 재미있게 배우는 타입스크립트</p>
              </div>
            </div>
            
            {/* 페이지 네비게이션 */}
            <nav className="flex gap-2 ml-8">
              <button
                onClick={() => onPageChange('lesson')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  currentPage === 'lesson'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>학습하기</span>
              </button>
              <button
                onClick={() => onPageChange('progress')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  currentPage === 'progress'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>진행 상황</span>
              </button>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://www.typescriptlang.org/docs/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              공식 문서
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
