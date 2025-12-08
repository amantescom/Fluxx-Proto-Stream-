import React from 'react';
import { useApp } from '../context';
import { MOCK_NEWS } from '../constants';
import { Share2, Award } from '../components/Icons';

export const News: React.FC = () => {
  const { addPoints } = useApp();

  const handleRead = (points: number) => {
    // Simulate reading logic
    addPoints(points);
    alert(`You earned ${points} points for reading this article!`);
  };

  return (
    <div className="pb-24">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Latest News</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_NEWS.map((item) => (
          <div key={item.id} className="bg-white dark:bg-dark-card rounded-xl overflow-hidden shadow hover:shadow-lg transition flex flex-col h-full">
            <div className="relative h-48">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur text-white text-xs px-2 py-1 rounded-md">
                {item.category}
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="text-xs text-gray-400 mb-2">{item.timestamp}</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">{item.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
                {item.summary}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                 <button 
                   onClick={() => handleRead(item.pointsValue)}
                   className="flex items-center text-brand-500 font-bold text-sm hover:text-brand-600"
                 >
                   Read Full Article
                 </button>
                 <div className="flex items-center gap-3">
                    <span className="flex items-center text-xs font-semibold text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded">
                        <Award size={12} className="mr-1" /> +{item.pointsValue}
                    </span>
                    <button className="text-gray-400 hover:text-brand-500"><Share2 size={18} /></button>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
