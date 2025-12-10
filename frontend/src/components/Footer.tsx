import { Heart, Mail, BookOpen } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="mb-3 text-gray-900">TypeScript Academy</h3>
            <p className="text-gray-600 leading-relaxed">
              TypeScript를 체계적으로 학습할 수 있는 인터랙티브 학습 플랫폼입니다.
            </p>
          </div>
          
          <div>
            <h3 className="mb-3 text-gray-900">학습 자료</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>기초 가이드</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>심화 학습</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>실전 프로젝트</span>
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-3 text-gray-900">문의</h3>
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4" />
              <span>support@tsacademy.com</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-300 text-center">
          <p className="text-gray-600 flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for TypeScript learners
          </p>
          <p className="text-gray-500 mt-2">
            © 2025 TypeScript Academy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
