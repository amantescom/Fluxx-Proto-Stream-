import React, { useState } from 'react';
import { useApp } from '../context';
import { 
  Users, Radio, ShoppingBag, TrendingUp, Film, Lock, ChevronRight, 
  Settings, MessageCircle, DollarSign, CheckCircle, XCircle, Search, Edit2, Trash2, Shield, Plus, AlertTriangle, LayoutDashboard
} from '../components/Icons';
import { User, MediaType } from '../types';

type AdminTab = 'overview' | 'users' | 'content' | 'shop' | 'finance' | 'settings' | 'support';

export const AdminDashboard: React.FC = () => {
  const { 
    users, radios, products, videos, audios, userStats, systemSettings, updateSystemSettings,
    tickets, resolveTicket, deleteUser, updateUser, adminAdjustBalance,
    approveMedia, deleteMedia, approveProduct, deleteProduct
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  
  // -- State for Sub-features --
  const [userSearch, setUserSearch] = useState('');
  const [balanceModal, setBalanceModal] = useState<{ open: boolean, userId: string, type: 'PS'|'REAL' }>({ open: false, userId: '', type: 'PS' });
  const [balanceAmount, setBalanceAmount] = useState(0);

  // --- Render Functions ---

  const renderOverview = () => {
    const cards = [
      { label: 'Usuários Ativos', value: users.filter(u => u.status === 'Active').length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20' },
      { label: 'Conteúdos', value: videos.length + audios.length, icon: Film, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/20' },
      { label: 'Anúncios', value: products.length, icon: ShoppingBag, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/20' },
      { label: 'Saldo Sistema (PTS)', value: '1.2M', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20' },
    ];

    return (
      <div className="space-y-8 animate-in fade-in">
        <h2 className="text-2xl font-bold dark:text-white">Visão Geral</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <div key={idx} className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
                <div className={`p-4 rounded-full ${card.bg} ${card.color} mr-4`}>
                  <card.icon size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{card.label}</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</h3>
                </div>
            </div>
          ))}
        </div>
        
        {/* Placeholder Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-64 flex flex-col justify-center items-center text-center">
                <TrendingUp size={48} className="text-gray-300 mb-2" />
                <p className="font-bold text-gray-500">Fluxo de Proto Stream</p>
                <span className="text-xs text-green-500 font-bold">+15% essa semana</span>
            </div>
            <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-64 flex flex-col justify-center items-center text-center">
                <Users size={48} className="text-gray-300 mb-2" />
                <p className="font-bold text-gray-500">Novos Usuários</p>
                <span className="text-xs text-blue-500 font-bold">+32 hoje</span>
            </div>
        </div>
      </div>
    );
  };

  const renderUsers = () => {
    const filtered = users.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()));
    
    const handleAdjust = () => {
        if(balanceAmount !== 0) {
            adminAdjustBalance(balanceModal.userId, balanceAmount, balanceModal.type, "Ajuste Admin Manual");
            setBalanceModal({ ...balanceModal, open: false });
            setBalanceAmount(0);
            alert("Saldo atualizado com sucesso!");
        }
    };

    return (
      <div className="space-y-6 animate-in fade-in">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold dark:text-white">Gerenciar Usuários</h2>
            <div className="relative">
                <input 
                    type="text" placeholder="Buscar usuário..." 
                    className="pl-8 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-surface dark:text-white"
                    value={userSearch} onChange={e => setUserSearch(e.target.value)}
                />
                <Search size={16} className="absolute left-2.5 top-3 text-gray-400" />
            </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-dark-surface">
                    <tr>
                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">User</th>
                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Saldo (PTS)</th>
                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filtered.map(u => (
                        <tr key={u.id}>
                            <td className="px-6 py-4">
                                <div className="font-bold dark:text-white">{u.name}</div>
                                <div className="text-xs text-gray-500">{u.email}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${u.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.status}</span>
                            </td>
                            <td className="px-6 py-4 dark:text-white font-mono">{u.protoStreamBalance} PTS</td>
                            <td className="px-6 py-4 flex gap-2">
                                <button title="Ajustar Saldo" onClick={() => setBalanceModal({ open: true, userId: u.id, type: 'PS' })} className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"><DollarSign size={16}/></button>
                                <button title="Banir" onClick={() => { if(confirm('Banir usuário?')) updateUser(u.id, { status: 'Banned' }) }} className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100"><Shield size={16}/></button>
                                <button title="Deletar" onClick={() => { if(confirm('Excluir conta?')) deleteUser(u.id) }} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Balance Modal */}
        {balanceModal.open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="bg-white dark:bg-dark-card p-6 rounded-xl w-full max-w-sm">
                    <h3 className="font-bold text-lg mb-4 dark:text-white">Ajustar Saldo Manual</h3>
                    <input type="number" className="w-full border p-2 rounded mb-4 dark:bg-dark-surface dark:text-white" placeholder="Quantidade (+ ou -)" onChange={e => setBalanceAmount(Number(e.target.value))} />
                    <div className="flex gap-2">
                        <button onClick={() => setBalanceModal({ ...balanceModal, open: false })} className="flex-1 py-2 bg-gray-200 rounded">Cancelar</button>
                        <button onClick={handleAdjust} className="flex-1 py-2 bg-brand-600 text-white rounded">Confirmar</button>
                    </div>
                </div>
            </div>
        )}
      </div>
    );
  };

  const renderContent = () => (
    <div className="space-y-6 animate-in fade-in">
        <h2 className="text-2xl font-bold dark:text-white">Moderação de Conteúdo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...videos, ...audios].map(media => (
                <div key={media.id} className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative">
                    <div className="absolute top-2 right-2 z-10">
                        {media.status === 'approved' && <span className="bg-green-500 text-white text-[10px] px-2 py-1 rounded font-bold">APROVADO</span>}
                        {media.status === 'rejected' && <span className="bg-red-500 text-white text-[10px] px-2 py-1 rounded font-bold">REJEITADO</span>}
                        {media.status === 'pending' && <span className="bg-yellow-500 text-white text-[10px] px-2 py-1 rounded font-bold animate-pulse">PENDENTE</span>}
                    </div>
                    <div className="h-32 bg-gray-200 rounded-lg mb-3 overflow-hidden">
                        <img src={media.thumbnail} className="w-full h-full object-cover opacity-80" />
                    </div>
                    <h4 className="font-bold dark:text-white truncate">{media.title}</h4>
                    <p className="text-xs text-gray-500 mb-3">Por: {media.author || 'Desconhecido'}</p>
                    
                    <div className="flex gap-2">
                        <button onClick={() => approveMedia(media.id, 'approved')} className="flex-1 bg-green-50 text-green-600 py-1 rounded hover:bg-green-100 text-xs font-bold">Aprovar</button>
                        <button onClick={() => approveMedia(media.id, 'rejected')} className="flex-1 bg-red-50 text-red-600 py-1 rounded hover:bg-red-100 text-xs font-bold">Rejeitar</button>
                        <button onClick={() => deleteMedia(media.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );

  const renderShop = () => (
    <div className="space-y-6 animate-in fade-in">
        <h2 className="text-2xl font-bold dark:text-white">Gerenciar Loja</h2>
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-dark-surface">
                    <tr>
                        <th className="px-6 py-3 text-xs font-bold text-gray-500">Produto</th>
                        <th className="px-6 py-3 text-xs font-bold text-gray-500">Preço</th>
                        <th className="px-6 py-3 text-xs font-bold text-gray-500">Status</th>
                        <th className="px-6 py-3 text-xs font-bold text-gray-500">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {products.map(p => (
                        <tr key={p.id}>
                            <td className="px-6 py-4">
                                <div className="font-bold dark:text-white">{p.name}</div>
                                <div className="text-xs text-gray-500">{p.seller.name}</div>
                            </td>
                            <td className="px-6 py-4 text-brand-500 font-bold">{p.price} PTS</td>
                            <td className="px-6 py-4">
                                <span className={`text-xs font-bold px-2 py-1 rounded ${
                                    p.status === 'approved' ? 'bg-green-100 text-green-700' :
                                    p.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>{p.status || 'Active'}</span>
                            </td>
                            <td className="px-6 py-4 flex gap-2">
                                <button onClick={() => approveProduct(p.id, 'approved')} className="text-green-500 hover:bg-green-50 p-1 rounded"><CheckCircle size={18}/></button>
                                <button onClick={() => approveProduct(p.id, 'rejected')} className="text-red-500 hover:bg-red-50 p-1 rounded"><XCircle size={18}/></button>
                                <button onClick={() => deleteProduct(p.id)} className="text-gray-400 hover:text-red-500 p-1"><Trash2 size={18}/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  const renderFinance = () => (
    <div className="space-y-6 animate-in fade-in">
        <h2 className="text-2xl font-bold dark:text-white">Financeiro & Transações</h2>
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between">
                <span className="font-bold text-gray-500">Log Global de Transações</span>
                <button className="text-xs bg-brand-50 text-brand-600 px-3 py-1 rounded">Exportar CSV</button>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-dark-surface sticky top-0">
                        <tr>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500">Data</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500">Tipo</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500">Descrição</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 text-right">Valor</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {userStats.transactions.map(t => (
                            <tr key={t.id}>
                                <td className="px-6 py-3 text-xs text-gray-500">{new Date(t.date).toLocaleDateString()}</td>
                                <td className="px-6 py-3 text-xs font-bold uppercase">{t.type}</td>
                                <td className="px-6 py-3 text-sm dark:text-gray-300">{t.description}</td>
                                <td className={`px-6 py-3 text-sm font-bold text-right ${t.type === 'EARN' || t.type === 'DEPOSIT' ? 'text-green-500' : 'text-red-500'}`}>
                                    {t.type === 'EARN' || t.type === 'DEPOSIT' ? '+' : '-'}{t.amount}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6 animate-in fade-in">
        <h2 className="text-2xl font-bold dark:text-white">Configurações do Sistema</h2>
        <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm max-w-2xl">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Recompensa por Minuto (PTS)</label>
                    <input 
                        type="number" 
                        value={systemSettings.rewardPerMinute}
                        onChange={e => updateSystemSettings({ rewardPerMinute: Number(e.target.value) })}
                        className="w-full p-2 border rounded dark:bg-dark-surface dark:text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">Quanto o usuário e criador ganham a cada 60s.</p>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Custo de Anúncio (PTS)</label>
                    <input 
                        type="number" 
                        value={systemSettings.adCost}
                        onChange={e => updateSystemSettings({ adCost: Number(e.target.value) })}
                        className="w-full p-2 border rounded dark:bg-dark-surface dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Taxa de Conversão (PTS para 1 Real)</label>
                    <input 
                        type="number" 
                        value={systemSettings.conversionRate}
                        onChange={e => updateSystemSettings({ conversionRate: Number(e.target.value) })}
                        className="w-full p-2 border rounded dark:bg-dark-surface dark:text-white"
                    />
                </div>
                <div className="flex items-center gap-3 pt-4">
                    <input 
                        type="checkbox" 
                        checked={systemSettings.maintenanceMode} 
                        onChange={e => updateSystemSettings({ maintenanceMode: e.target.checked })}
                        className="w-5 h-5 text-brand-600"
                    />
                    <span className="font-bold text-red-500">Modo Manutenção (Bloqueia Acesso)</span>
                </div>
            </div>
        </div>
    </div>
  );

  const renderSupport = () => (
    <div className="space-y-6 animate-in fade-in">
        <h2 className="text-2xl font-bold dark:text-white">Suporte & Tickets</h2>
        <div className="space-y-4">
            {tickets.map(ticket => (
                <div key={ticket.id} className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${ticket.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{ticket.status}</span>
                            <span className="text-xs text-gray-400">{new Date(ticket.date).toLocaleDateString()}</span>
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{ticket.subject}</h4>
                        <p className="text-xs text-gray-500">Usuário: {ticket.userName}</p>
                    </div>
                    {ticket.status === 'Open' && (
                        <button 
                            onClick={() => resolveTicket(ticket.id)}
                            className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-700"
                        >
                            Resolver
                        </button>
                    )}
                </div>
            ))}
            {tickets.length === 0 && <p className="text-gray-500">Nenhum ticket aberto.</p>}
        </div>
    </div>
  );

  // --- Main Layout ---

  const navItems = [
    { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'content', label: 'Conteúdos', icon: Film },
    { id: 'shop', label: 'Shop Admin', icon: ShoppingBag },
    { id: 'finance', label: 'Financeiro', icon: DollarSign },
    { id: 'settings', label: 'Configurações', icon: Settings },
    { id: 'support', label: 'Suporte', icon: MessageCircle },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen pb-24 lg:pb-0 gap-6">
        {/* Internal Sidebar */}
        <div className="lg:w-64 shrink-0">
            <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-2 sticky top-24">
                <div className="p-4 mb-2">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
                    <p className="text-xs text-gray-500">Super Admin Access</p>
                </div>
                <nav className="space-y-1">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as AdminTab)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                                activeTab === item.id 
                                ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30' 
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        >
                            <item.icon size={18} /> {item.label}
                        </button>
                    ))}
                </nav>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'content' && renderContent()}
            {activeTab === 'shop' && renderShop()}
            {activeTab === 'finance' && renderFinance()}
            {activeTab === 'settings' && renderSettings()}
            {activeTab === 'support' && renderSupport()}
        </div>
    </div>
  );
};