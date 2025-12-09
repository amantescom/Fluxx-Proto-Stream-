import React, { useState } from 'react';
import { useApp } from '../context';
import { ShoppingBag, Search, Trash2, Eye, AlertTriangle } from '../components/Icons';

export const AdminShop: React.FC = () => {
  const { products, deleteProduct } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.seller.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-24">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Moderação da Loja</h1>
          <p className="text-gray-500 dark:text-gray-400">Visualize e remova produtos proibidos ou inadequados.</p>
        </div>
        <div className="p-4 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-full border border-orange-200 dark:border-orange-800">
           <ShoppingBag size={32} />
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="text-gray-400" size={18} />
        </div>
        <input
          type="text"
          placeholder="Buscar produto, categoria ou vendedor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all shadow-sm"
        />
      </div>

      {/* Product List Table */}
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-dark-surface border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Produto</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Preço</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vendedor</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-dark-surface/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 shrink-0 border border-gray-100 dark:border-gray-700">
                            <img className="h-full w-full object-cover" src={product.images[0]} alt="" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[200px]">{product.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-brand-600 dark:text-brand-400">{product.price} PTS</div>
                      <div className="text-xs text-gray-400">R$ {(product.price / 10).toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img className="h-6 w-6 rounded-full mr-2 object-cover border border-gray-200" src={product.seller.avatar} alt="" />
                        <span className="text-sm text-gray-900 dark:text-gray-300 font-medium">{product.seller.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => { if(window.confirm(`Remover produto "${product.name}"?`)) deleteProduct(product.id); }}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 flex items-center justify-center gap-2 w-full transition-colors"
                      >
                        <Trash2 size={16} /> Banir
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                        <ShoppingBag size={48} className="text-gray-300 dark:text-gray-600 mb-2" />
                        <p>Nenhum produto encontrado.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};