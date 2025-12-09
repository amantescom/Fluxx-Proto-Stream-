
import React, { useState } from 'react';
import { useApp } from '../context';
import { Wallet as WalletIcon, Coins, TrendingUp, ArrowDown, ArrowUp, Plus, LayoutDashboard, Play, Video, Lock } from '../components/Icons';

export const Wallet: React.FC = () => {
  const { userStats, deposit, withdraw, exchangeProtoToReal } = useApp();
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showExchange, setShowExchange] = useState(false);
  const [amount, setAmount] = useState<number>(0);

  // Stats Calculations
  const totalBalanceReal = (userStats.protoStreamBalance / 10).toFixed(2);
  
  const earningsFromLives = userStats.transactions
    .filter(t => t.type === 'EARN' && (t.description.includes('Live') || t.description.includes('Stream') || t.description.includes('Assistiu')))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const earningsFromShorts = userStats.transactions
    .filter(t => t.type === 'EARN' && (t.description.includes('Short') || t.description.includes('Clip') || t.description.includes('Postado')))
    .reduce((acc, curr) => acc + curr.amount, 0);
    
  const adSpend = userStats.transactions
    .filter(t => t.type === 'SPEND' && t.description.includes('Anúncio'))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleDeposit = () => {
    if (amount > 0) {
        deposit(amount);
        setShowDeposit(false);
        setAmount(0);
        alert("Recarga realizada com sucesso!");
    }
  };

  const handleWithdraw = () => {
    if (amount > 0) {
        if(withdraw(amount)) {
            setShowWithdraw(false);
            setAmount(0);
            alert("Saque solicitado com sucesso!");
        } else {
            alert("Saldo insuficiente em Reais.");
        }
    }
  };

  const handleExchange = () => {
    if (amount > 0) {
        if(exchangeProtoToReal(amount)) {
            setShowExchange(false);
            setAmount(0);
            alert(`Sucesso! ${amount} PTS convertidos em Reais.`);
        } else {
            alert("Saldo insuficiente de Proto Stream.");
        }
    }
  };

  return (
    <div className="pb-24 max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/30 text-white">
            <WalletIcon size={32} />
        </div>
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Carteira Proto Stream</h1>
            <p className="text-gray-500 dark:text-gray-400">Gerencie seus ganhos e investimentos na plataforma</p>
        </div>
      </div>

      {/* Main Balances */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Total Balance Card (Always Green/Emerald for Money) */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 opacity-80">
                    <Coins size={20} />
                    <span className="font-bold uppercase tracking-wider text-sm">Saldo Total</span>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                    <h2 className="text-6xl font-black">{userStats.protoStreamBalance}</h2>
                    <span className="text-2xl font-bold opacity-80">PTS</span>
                </div>
                <div className="bg-white/10 inline-block px-3 py-1 rounded-lg backdrop-blur-sm mb-6">
                    <span className="font-mono font-bold">≈ R$ {totalBalanceReal}</span>
                </div>
                
                <div className="flex gap-3">
                    <button 
                        onClick={() => setShowDeposit(true)}
                        className="bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg flex items-center gap-2"
                    >
                        <Plus size={18} /> Adicionar
                    </button>
                    <button 
                        onClick={() => setShowExchange(true)}
                        className="bg-emerald-900/50 text-white border border-white/20 px-6 py-3 rounded-xl font-bold hover:bg-emerald-900/70 transition flex items-center gap-2"
                    >
                        <LayoutDashboard size={18} /> Converter
                    </button>
                </div>
            </div>
            <Coins className="absolute -bottom-8 -right-8 text-white opacity-10 group-hover:scale-110 transition-transform duration-500" size={200} />
        </div>

        {/* Real Wallet Card (Withdrawable) */}
        <div className="bg-white dark:bg-dark-card rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 text-gray-500 dark:text-gray-400">
                    <WalletIcon size={20} />
                    <span className="font-bold uppercase tracking-wider text-sm">Disponível para Saque</span>
                </div>
                <h2 className="text-5xl font-black text-gray-900 dark:text-white mb-2">R$ {userStats.walletBalance.toFixed(2)}</h2>
                <p className="text-gray-400 text-sm mb-6">Saldo em Reais acumulado</p>

                <button 
                    onClick={() => setShowWithdraw(true)}
                    className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl font-bold hover:opacity-90 transition shadow-lg flex items-center gap-2"
                >
                    <ArrowUp size={18} /> Sacar Valor
                </button>
            </div>
        </div>
      </div>

      {/* Earnings Breakdown */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Detalhamento de Ganhos</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Live Earnings */}
          <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
              <div className="p-4 rounded-full bg-red-100 text-red-600 dark:bg-red-900/20">
                  <Play size={24} />
              </div>
              <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Lives & Streaming</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{earningsFromLives} PTS</p>
              </div>
          </div>

          {/* Shorts Earnings */}
          <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
              <div className="p-4 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/20">
                  <Video size={24} />
              </div>
              <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Shorts & Clips</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{earningsFromShorts} PTS</p>
              </div>
          </div>

          {/* Ad Spend */}
          <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
              <div className="p-4 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/20">
                  <Lock size={24} />
              </div>
              <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Gasto com Anúncios</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{adSpend} PTS</p>
              </div>
          </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white dark:bg-dark-card rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="text-emerald-500" /> Histórico de Transações
            </h3>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {userStats.transactions.length > 0 ? (
                userStats.transactions.map((t) => (
                    <div key={t.id} className="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-surface/50 transition">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${
                                t.type === 'EARN' || t.type === 'DEPOSIT' || t.type === 'SALE'
                                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' 
                                : t.type === 'EXCHANGE'
                                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                                {t.type === 'EARN' || t.type === 'DEPOSIT' || t.type === 'SALE' ? <ArrowDown size={20} /> : <ArrowUp size={20} />}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white">{t.description}</p>
                                <p className="text-xs text-gray-400">{new Date(t.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={`text-lg font-bold ${
                                t.type === 'EARN' || t.type === 'DEPOSIT' || t.type === 'SALE' ? 'text-emerald-500' : 'text-gray-900 dark:text-white'
                            }`}>
                                {t.type === 'EARN' || t.type === 'DEPOSIT' || t.type === 'SALE' ? '+' : '-'}{t.amount} {t.type === 'WITHDRAW' ? 'R$' : 'PTS'}
                            </span>
                        </div>
                    </div>
                ))
            ) : (
                <div className="p-12 text-center text-gray-500">Nenhuma transação encontrada.</div>
            )}
        </div>
      </div>

      {/* Deposit Modal */}
      {showDeposit && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-dark-card p-8 rounded-2xl w-full max-w-md shadow-2xl">
               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Recarga de Proto Stream</h2>
               <p className="text-gray-500 mb-6">10 PTS = R$ 1,00</p>
               
               <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Quantidade de PTS</label>
               <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-dark-surface mb-4 text-xl font-bold"
                  placeholder="0"
               />
               <div className="flex justify-between text-sm mb-6 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                  <span>Custo em Reais:</span>
                  <span className="font-bold">R$ {(amount / 10).toFixed(2)}</span>
               </div>
               
               <div className="flex gap-4">
                  <button onClick={() => setShowDeposit(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl">Cancelar</button>
                  <button onClick={handleDeposit} className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700">Confirmar</button>
               </div>
            </div>
         </div>
      )}

      {/* Exchange Modal */}
      {showExchange && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-dark-card p-8 rounded-2xl w-full max-w-md shadow-2xl">
               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Converter PTS para Real</h2>
               <p className="text-gray-500 mb-6">Converta seus ganhos para saldo de saque.<br/>10 PTS = R$ 1,00</p>
               
               <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Quantidade de PTS para converter</label>
               <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-dark-surface mb-4 text-xl font-bold"
                  placeholder="0"
                  max={userStats.protoStreamBalance}
               />
               <div className="flex justify-between text-sm mb-6 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                  <span>Você recebe:</span>
                  <span className="font-bold text-emerald-500">R$ {(amount / 10).toFixed(2)}</span>
               </div>
               
               <div className="flex gap-4">
                  <button onClick={() => setShowExchange(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl">Cancelar</button>
                  <button onClick={handleExchange} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">Converter</button>
               </div>
            </div>
         </div>
      )}

      {/* Withdraw Modal */}
      {showWithdraw && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-dark-card p-8 rounded-2xl w-full max-w-md shadow-2xl">
               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Sacar Reais</h2>
               <p className="text-gray-500 mb-6">Disponível: R$ {userStats.walletBalance.toFixed(2)}</p>
               
               <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Valor (R$)</label>
               <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-dark-surface mb-6 text-xl font-bold"
                  placeholder="0.00"
               />
               
               <div className="flex gap-4">
                  <button onClick={() => setShowWithdraw(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl">Cancelar</button>
                  <button onClick={handleWithdraw} className="flex-1 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl">Solicitar Saque</button>
               </div>
            </div>
         </div>
      )}

    </div>
  );
};
