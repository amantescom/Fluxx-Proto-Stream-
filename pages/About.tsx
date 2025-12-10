
import React from 'react';
import { Info, Shield, Globe, Award, Heart } from '../components/Icons';

export const About: React.FC = () => {
  return (
    <div className="pb-24 max-w-4xl mx-auto">
      <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <img src="https://i.imgur.com/v8p5v9X.png" alt="Fluxx" className="h-24 mx-auto mb-6" />
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Sobre o Fluxx Stream</h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              A plataforma de streaming completa que recompensa sua interação. TV Ao Vivo, Rádio, Podcasts e muito mais em um único lugar.
          </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-dark-card p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                  <Globe size={24} />
              </div>
              <h3 className="text-xl font-bold dark:text-white mb-2">Conectividade Global</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  Acesse conteúdos de criadores e canais de todo o mundo. Nossa infraestrutura garante streaming de alta qualidade onde quer que você esteja.
              </p>
          </div>

          <div className="bg-white dark:bg-dark-card p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/20 text-brand-600 rounded-2xl flex items-center justify-center mb-4">
                  <Award size={24} />
              </div>
              <h3 className="text-xl font-bold dark:text-white mb-2">Sistema de Recompensas</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  Ganhe Proto Stream (PTS) assistindo vídeos, ouvindo músicas e interagindo. Troque seus pontos por produtos reais ou benefícios na plataforma.
              </p>
          </div>

          <div className="bg-white dark:bg-dark-card p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
                  <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold dark:text-white mb-2">Segurança e Privacidade</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  Seus dados são protegidos com a mais alta tecnologia de criptografia. Valorizamos sua privacidade e garantimos um ambiente seguro.
              </p>
          </div>

          <div className="bg-white dark:bg-dark-card p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-2xl flex items-center justify-center mb-4">
                  <Heart size={24} />
              </div>
              <h3 className="text-xl font-bold dark:text-white mb-2">Feito com Paixão</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  Desenvolvido por uma equipe dedicada a transformar a maneira como você consome conteúdo digital. Junte-se à revolução do streaming.
              </p>
          </div>
      </div>

      <div className="bg-brand-600 rounded-3xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Pronto para começar?</h2>
          <p className="mb-6 opacity-90">Explore milhares de conteúdos e comece a ganhar hoje mesmo.</p>
          <div className="flex justify-center gap-4">
              <button className="bg-white text-brand-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition">Explorar Loja</button>
              <button className="bg-brand-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-800 transition">Criar Conta</button>
          </div>
      </div>
      
      <div className="mt-12 text-center text-gray-400 text-sm">
          <p>&copy; 2024 Fluxx Stream. Todos os direitos reservados.</p>
          <p className="mt-2">Versão 2.5.0 (Beta)</p>
      </div>
    </div>
  );
};
