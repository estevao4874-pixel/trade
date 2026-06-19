import React, { useState, useEffect } from 'react';

// ==========================================
// INTERFACES E TIPAGENS DO SISTEMA
// ==========================================
interface Sticker {
  id: string;
  number: string;
  player_name: string;
  team: string;
  position: string;
  current_club: string;
  category: 'Jogador' | 'Escudo' | 'Especial';
  rarity: 'Comum' | 'Rara' | 'Brilhante';
  quantity: number;
}

interface UserProfile {
  id: string;
  username: string;
  email: string;
  isOnline: boolean;
  lastLogin: string;
  album: Record<string, number>;
  friends: string[];
  friendRequests: string[];
  tradesCount: number;
}

interface ChatMessage {
  id: string;
  sender: string;
  receiver: 'GLOBAL' | string;
  text: string;
  timestamp: string;
}

interface Match {
  id: string;
  team1: string;
  team2: string;
  date: string;
  time: string;
  stadium: string;
  stage: string;
  score1?: number;
  score2?: number;
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED';
}

interface SystemLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'DANGER';
}

// ==========================================
// BANCO DE DADOS DE SELEÇÕES E CRAQUES REAIS
// ==========================================
const JOGADORES_REAIS: Record<string, string[]> = {
  'Brasil': ['Alisson', 'Danilo', 'Marquinhos', 'Gabriel Magalhães', 'Arana', 'Bruno Guimarães', 'Paquetá', 'Rodrygo', 'Raphinha', 'Vinicius Jr', 'Neymar Jr', 'Endrick', 'Éder Militão', 'Casemiro', 'Lucas Beraldo', 'João Gomes', 'Savinho', 'Martinelli', 'Pedro'],
  'Argentina': ['E. Martínez', 'Molina', 'Romero', 'Otamendi', 'Tagliafico', 'De Paul', 'Enzo Fernández', 'Mac Allister', 'Messi', 'Álvarez', 'Di María', 'Lautaro Martínez', 'Montiel', 'Paredes', 'Lo Celso', 'Garnacho', 'Dybala', 'Acunha', 'Correa'],
  'França': ['Maignan', 'Koundé', 'Upamecano', 'Saliba', 'Hernández', 'Chouaméni', 'Camavinga', 'Rabiot', 'Griezmann', 'Dembélé', 'Mbappé', 'Giroud', 'Pavard', 'Konaté', 'Fofana', 'Coman', 'Barcola', 'Thuram', 'Kolo Muani'],
  'Portugal': ['Diogo Costa', 'Cancelo', 'Rúben Dias', 'Pepe', 'Nuno Mendes', 'Palhinha', 'Vitinha', 'Bruno Fernandes', 'Bernardo Silva', 'Cristiano Ronaldo', 'Rafael Leão', 'João Félix', 'Dalot', 'Inácio', 'Neves', 'Otávio', 'Jota', 'Ramos', 'Neto'],
  'Inglaterra': ['Pickford', 'Walker', 'Stones', 'Guehi', 'Trippier', 'Rice', 'Mainoo', 'Bellingham', 'Saka', 'Kane', 'Foden', 'Palmer', 'Ramsdale', 'Alexander-Arnold', 'Shaw', 'Gallagher', 'Gordon', 'Watkins', 'Toney'],
  'Alemanha': ['Neuer', 'Kimmich', 'Rüdiger', 'Tah', 'Mittelstädt', 'Andrich', 'Kroos', 'Musiala', 'Gündogan', 'Wirtz', 'Havertz', 'Füllkrug', 'Ter Stegen', 'Schlotterbeck', 'Raum', 'Gross', 'Sané', 'Müller', 'Beier']
};

const SELECOES_COPA = [
  'Todas', 'FIFA', 'Brasil', 'Argentina', 'França', 'Inglaterra', 'Alemanha', 'Espanha', 'Portugal', 'Uruguai',
  'México', 'Estados Unidos', 'Canadá', 'Marrocos', 'Bélgica', 'Holanda', 'Itália', 'Croácia',
  'Japão', 'Coreia do Sul', 'Senegal', 'Egito', 'Nigéria', 'Camarões', 'Argélia', 'Tunísia',
  'Gana', 'Arábia Saudita', 'Irã', 'Austrália', 'Nova Zelândia', 'Equador', 'Colômbia', 'Peru',
  'Chile', 'Paraguai', 'Venezuela', 'Costa Rica', 'Panamá', 'Jamaica', 'Suíça', 'Dinamarca',
  'Sérvia', 'Polônia', 'Escócia', 'Áustria', 'Turquia', 'Ucrânia', 'Suécia'
];

const gerarBancoMasterFigurinhas = (): Sticker[] => {
  const lista: Sticker[] = [];
  let idGlobal = 1;

  for (let i = 1; i <= 20; i++) {
    lista.push({
      id: String(idGlobal++),
      number: `FIFA ${i < 10 ? '0' + i : i}`,
      player_name: i === 1 ? 'Taça da Copa do Mundo 🏆' : i === 2 ? 'Mascote Oficial 🦊' : `Estádio Sede ${i - 2} 🏟️`,
      team: 'FIFA',
      position: 'Especial',
      current_club: 'FIFA World Cup',
      category: 'Especial',
      rarity: 'Brilhante',
      quantity: 0
    });
  }

  SELECOES_COPA.filter(p => p !== 'Todas' && p !== 'FIFA').forEach(pais => {
    const prefixo = pais.substring(0, 3).toUpperCase();
    const nomesDoPais = JOGADORES_REAIS[pais] || [];

    for (let i = 1; i <= 20; i++) {
      let nomeJogador = `Jogador nº ${i}`;
      if (i === 1) nomeJogador = `Escudo Oficial`;
      else if (nomesDoPais[i - 2]) nomeJogador = nomesDoPais[i - 2];

      lista.push({
        id: String(idGlobal++),
        number: `${prefixo} ${i < 10 ? '0' + i : i}`,
        player_name: nomeJogador,
        team: pais,
        position: i === 1 ? 'Emblema' : i === 2 ? 'Goleiro' : i <= 7 ? 'Defensor' : i <= 14 ? 'Meio-Campista' : 'Atacante',
        current_club: i === 1 ? 'Federação' : 'Clube Internacional',
        category: i === 1 ? 'Escudo' : 'Jogador',
        rarity: i === 1 ? 'Brilhante' : i === 11 || i === 10 ? 'Rara' : 'Comum',
        quantity: 0
      });
    }
  });

  return lista;
};

const BANCO_MASTER_ESTÁTICO = gerarBancoMasterFigurinhas();

export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(localStorage.getItem('tf_current_user'));
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'dev'>('register');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [emailInput, setEmailInput] = useState('');

  const [currentTab, setCurrentTab] = useState<string>('album');
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [subTabFilter, setSubTabFilter] = useState<'all' | 'have' | 'missing' | 'repeated'>('all');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('Todas');
  const [searchFilter, setSearchFilter] = useState('');
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);

  const [dbUsers, setDbUsers] = useState<Record<string, UserProfile>>({});
  const [dbMatches, setDbMatches] = useState<Match[]>([]);
  const [dbLogs, setDbLogs] = useState<SystemLog[]>([]);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [activeChatTarget, setActiveChatTarget] = useState<string>('GLOBAL');
  const [typedMessage, setTypedMessage] = useState<string>('');
  const [friendSearchInput, setFriendSearchInput] = useState<string>('');

  // Estados Avançados de Edição do Desenvolvedor
  const [devUserSearch, setDevUserSearch] = useState('');
  const [selectedDevTargetUser, setSelectedDevTargetUser] = useState<string>('');
  const [devStickerIdInput, setDevStickerIdInput] = useState('');
  const [devStickerQtyInput, setDevStickerQtyInput] = useState('1');
  
  // Modificação de Jogos
  const [matchTeam1, setMatchTeam1] = useState('');
  const [matchTeam2, setMatchTeam2] = useState('');
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [editTeam1, setEditTeam1] = useState('');
  const [editTeam2, setEditTeam2] = useState('');
  const [editScore1, setEditScore1] = useState('0');
  const [editScore2, setEditScore2] = useState('0');
  const [editStatus, setEditStatus] = useState<'SCHEDULED' | 'LIVE' | 'FINISHED'>('SCHEDULED');

  useEffect(() => {
    if (!localStorage.getItem('tf_users_db_v4')) {
      const initialDb: Record<string, UserProfile> = {
        'admin': { id: 'u_admin', username: 'admin', email: 'admin@copa.com', isOnline: true, lastLogin: new Date().toLocaleString(), album: {}, friends: ['Colecionador99'], friendRequests: [], tradesCount: 0 },
        'Colecionador99': { id: 'u_1', username: 'Colecionador99', email: 'user1@copa.com', isOnline: false, lastLogin: '19/06/2026 15:00', album: {'1': 3, '22': 1}, friends: ['admin'], friendRequests: [], tradesCount: 5 }
      };
      localStorage.setItem('tf_users_db_v4', JSON.stringify(initialDb));
    }
    if (!localStorage.getItem('tf_matches_db')) {
      const initialMatches: Match[] = [
        { id: 'm1', team1: 'México 🇲🇽', team2: 'França 🇫🇷', date: '11/06/2026', time: '16:00', stadium: 'Estádio Azteca', stage: 'Abertura (Grupo A)', score1: 0, score2: 0, status: 'SCHEDULED' },
        { id: 'm2', team1: 'EUA 🇺🇸', team2: 'Alemanha 🇩🇪', date: '12/06/2026', time: '18:00', stadium: 'Los Angeles Stadium', stage: 'Fase de Grupos', score1: 0, score2: 0, status: 'SCHEDULED' }
      ];
      localStorage.setItem('tf_matches_db', JSON.stringify(initialMatches));
    }
    if (!localStorage.getItem('tf_chat_db')) {
      const initialChats: ChatMessage[] = [
        { id: 'c1', sender: 'admin', receiver: 'GLOBAL', text: 'Sejam bem-vindos ao chat supremo de trocas!', timestamp: '15:05' }
      ];
      localStorage.setItem('tf_chat_db', JSON.stringify(initialChats));
    }
    refreshData();
  }, [currentUser]);

  const refreshData = () => {
    const users = JSON.parse(localStorage.getItem('tf_users_db_v4') || '{}');
    const matchesData = JSON.parse(localStorage.getItem('tf_matches_db') || '[]');
    const chatsData = JSON.parse(localStorage.getItem('tf_chat_db') || '[]');
    
    setDbUsers(users);
    setDbMatches(matchesData);
    setChatMessages(chatsData);

    if (currentUser && users[currentUser]) {
      const userAlbum = users[currentUser].album || {};
      const syncStickers = BANCO_MASTER_ESTÁTICO.map(st => ({
        ...st,
        quantity: userAlbum[st.id] || 0
      }));
      setStickers(syncStickers);
    }
  };

  const addLog = (message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'DANGER' = 'INFO') => {
    const newLog: SystemLog = { id: String(Date.now()), timestamp: new Date().toLocaleTimeString(), message, type };
    setDbLogs(prev => [newLog, ...prev]);
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput || !passwordInput) return alert('Preencha os dados!');

    if (authMode === 'dev') {
      if (usernameInput === 'admin' && passwordInput === 'admin') {
        localStorage.setItem('tf_current_user', 'admin');
        setCurrentUser('admin');
        addLog('Modo desenvolvedor liberado com privilégios ROOT.', 'SUCCESS');
      } else {
        alert('Credenciais administrativas incorretas.');
      }
      return;
    }

    const users = JSON.parse(localStorage.getItem('tf_users_db_v4') || '{}');

    if (authMode === 'register') {
      if (users[usernameInput]) return alert('Usuário já existe!');
      users[usernameInput] = {
        id: 'u_' + Date.now(), username: usernameInput, email: emailInput || `${usernameInput}@copa.com`,
        isOnline: true, lastLogin: new Date().toLocaleString(), album: {}, friends: [], friendRequests: [], tradesCount: 0
      };
      localStorage.setItem('tf_users_db_v4', JSON.stringify(users));
      alert('Registrado com sucesso! Agora você pode fazer o login.');
      setAuthMode('login');
    } else {
      if (!users[usernameInput]) return alert('Usuário não encontrado.');
      users[usernameInput].isOnline = true;
      localStorage.setItem('tf_users_db_v4', JSON.stringify(users));
      localStorage.setItem('tf_current_user', usernameInput);
      setCurrentUser(usernameInput);
    }
  };

  const alterarQuantidadeCromo = (id: string, incremento: number) => {
    if (!currentUser) return;
    const users = JSON.parse(localStorage.getItem('tf_users_db_v4') || '{}');
    const userAlbum = users[currentUser].album || {};
    
    const atual = userAlbum[id] || 0;
    const novoValor = Math.max(0, atual + incremento);
    
    if (novoValor === 0) delete userAlbum[id];
    else userAlbum[id] = novoValor;

    users[currentUser].album = userAlbum;
    localStorage.setItem('tf_users_db_v4', JSON.stringify(users));
    refreshData();
  };

  // Métricas
  const totalCromos = stickers.length;
  const obtidasCromos = stickers.filter(s => s.quantity > 0).length;
  const porcentagemProgresso = totalCromos > 0 ? Math.round((obtidasCromos / totalCromos) * 100) : 0;

  const cromosFiltrados = stickers.filter(s => {
    if (selectedTeamFilter !== 'Todas' && s.team !== selectedTeamFilter) return false;
    const termo = searchFilter.toLowerCase();
    const matchesSearch = s.player_name.toLowerCase().includes(termo) || s.number.toLowerCase().includes(termo) || s.team.toLowerCase().includes(termo);
    if (!matchesSearch) return false;
    if (subTabFilter === 'have') return s.quantity > 0;
    if (subTabFilter === 'missing') return s.quantity === 0;
    if (subTabFilter === 'repeated') return s.quantity > 1;
    return true;
  });

  // Amizades e Chat
  const enviarPedidoAmizade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !friendSearchInput || friendSearchInput === currentUser) return;
    const users = JSON.parse(localStorage.getItem('tf_users_db_v4') || '{}');
    if (!users[friendSearchInput]) return alert('Usuário não encontrado!');
    if (users[friendSearchInput].friendRequests.includes(currentUser) || users[friendSearchInput].friends.includes(currentUser)) return alert('Já solicitado.');
    users[friendSearchInput].friendRequests.push(currentUser);
    localStorage.setItem('tf_users_db_v4', JSON.stringify(users));
    alert(`Pedido enviado para @${friendSearchInput}`);
    setFriendSearchInput('');
    refreshData();
  };

  const responderPedidoAmizade = (remetente: string, aceitar: boolean) => {
    if (!currentUser) return;
    const users = JSON.parse(localStorage.getItem('tf_users_db_v4') || '{}');
    users[currentUser].friendRequests = users[currentUser].friendRequests.filter((name: string) => name !== remetente);
    if (aceitar) {
      if (!users[currentUser].friends.includes(remetente)) users[currentUser].friends.push(remetente);
      if (!users[remetente].friends.includes(currentUser)) users[remetente].friends.push(currentUser);
    }
    localStorage.setItem('tf_users_db_v4', JSON.stringify(users));
    refreshData();
  };

  const enviarMensagemChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !typedMessage.trim()) return;
    const chatsData = JSON.parse(localStorage.getItem('tf_chat_db') || '[]');
    chatsData.push({
      id: 'msg_' + Date.now(),
      sender: currentUser,
      receiver: activeChatTarget,
      text: typedMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    localStorage.setItem('tf_chat_db', JSON.stringify(chatsData));
    setTypedMessage('');
    refreshData();
  };

  const mensagensVisiveis = chatMessages.filter(m => {
    if (activeChatTarget === 'GLOBAL') return m.receiver === 'GLOBAL';
    return (m.sender === currentUser && m.receiver === activeChatTarget) || 
           (m.sender === activeChatTarget && m.receiver === currentUser);
  });

  // ==========================================
  // METODOS EXCLUSIVOS DO MODO DEV (CONTROLE TOTAL)
  // ==========================================
  const devInjetarFigurinhaEspecifica = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDevTargetUser) return alert('Selecione uma conta alvo!');
    if (!devStickerIdInput) return alert('Insira o ID da figurinha!');
    
    const targetSticker = BANCO_MASTER_ESTÁTICO.find(s => s.id === devStickerIdInput || s.number.toLowerCase() === devStickerIdInput.toLowerCase());
    if (!targetSticker) return alert('Figurinha não encontrada! Use IDs de 1 a 980.');

    const users = JSON.parse(localStorage.getItem('tf_users_db_v4') || '{}');
    const userAlbum = users[selectedDevTargetUser].album || {};
    
    const qtdNova = parseInt(devStickerQtyInput) || 1;
    userAlbum[targetSticker.id] = (userAlbum[targetSticker.id] || 0) + qtdNova;
    
    users[selectedDevTargetUser].album = userAlbum;
    localStorage.setItem('tf_users_db_v4', JSON.stringify(users));
    addLog(`Adicionado ${qtdNova}x [${targetSticker.number} - ${targetSticker.player_name}] para @${selectedDevTargetUser}`, 'SUCCESS');
    setDevStickerIdInput('');
    refreshData();
  };

  const devAdicionarJogo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchTeam1 || !matchTeam2) return;
    const matchesData = JSON.parse(localStorage.getItem('tf_matches_db') || '[]');
    matchesData.push({
      id: 'm_' + Date.now(), team1: matchTeam1, team2: matchTeam2,
      date: '24/06/2026', time: '16:00', stadium: 'MetLife Stadium', stage: 'Fase de Grupos', score1: 0, score2: 0, status: 'SCHEDULED'
    });
    localStorage.setItem('tf_matches_db', JSON.stringify(matchesData));
    setMatchTeam1(''); setMatchTeam2('');
    addLog(`Nova partida criada no sistema.`, 'SUCCESS');
    refreshData();
  };

  const devSalvarEdicaoJogo = (id: string) => {
    const matchesData = JSON.parse(localStorage.getItem('tf_matches_db') || '[]');
    const index = matchesData.findIndex((m: Match) => m.id === id);
    if (index === -1) return;

    matchesData[index].team1 = editTeam1 || matchesData[index].team1;
    matchesData[index].team2 = editTeam2 || matchesData[index].team2;
    matchesData[index].score1 = parseInt(editScore1) || 0;
    matchesData[index].score2 = parseInt(editScore2) || 0;
    matchesData[index].status = editStatus;

    localStorage.setItem('tf_matches_db', JSON.stringify(matchesData));
    setEditingMatchId(null);
    addLog(`Jogo ID ${id} atualizado para ${editTeam1} x ${editTeam2} (Placar: ${editScore1}x${editScore2})`, 'WARNING');
    refreshData();
  };

  const devDeletarJogo = (id: string) => {
    if (!window.confirm("Deseja apagar esse jogo permanentemente do calendário?")) return;
    const matchesData = JSON.parse(localStorage.getItem('tf_matches_db') || '[]');
    const filtrados = matchesData.filter((m: Match) => m.id !== id);
    localStorage.setItem('tf_matches_db', JSON.stringify(filtrados));
    setEditingMatchId(null);
    addLog(`Partida ID ${id} removida pelo administrador.`, 'DANGER');
    refreshData();
  };

  const devDeletarUsuario = (username: string) => {
    if (username === 'admin') return;
    const users = JSON.parse(localStorage.getItem('tf_users_db_v4') || '{}');
    delete users[username];
    localStorage.setItem('tf_users_db_v4', JSON.stringify(users));
    refreshData();
  };

  const devCriarUsuarioManualmente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!devUserSearch) return;
    const users = JSON.parse(localStorage.getItem('tf_users_db_v4') || '{}');
    if (users[devUserSearch]) return;
    users[devUserSearch] = {
      id: 'u_' + Date.now(), username: devUserSearch, email: `${devUserSearch}@copa.com`,
      isOnline: false, lastLogin: 'Root', album: {}, friends: [], friendRequests: [], tradesCount: 0
    };
    localStorage.setItem('tf_users_db_v4', JSON.stringify(users));
    setDevUserSearch('');
    refreshData();
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0d1626] flex flex-col items-center justify-center text-slate-100 p-6 relative">
        <div className="w-full max-w-md bg-[#13223d] border-2 border-[#d4af37]/30 p-8 text-center rounded-3xl shadow-2xl">
          <div className="w-20 h-20 bg-gradient-to-b from-[#d4af37] to-[#aa841b] rounded-full mx-auto flex items-center justify-center mb-4">
            <span className="text-4xl text-white">🏆</span>
          </div>
          <h1 className="text-2xl font-black text-white uppercase">Troca Figurinhas <span className="text-[#d4af37]">2026</span></h1>
          <p className="text-slate-400 text-xs mt-1 mb-6 uppercase tracking-widest">Acesso do Usuário</p>

          {/* ABAS DE ALTERNÂNCIA RECUPERADAS CONFORME PEDIDO */}
          {authMode !== 'dev' ? (
            <div className="flex gap-2 bg-[#09101d] p-1.5 rounded-xl mb-6 border border-slate-800">
              <button type="button" onClick={() => setAuthMode('register')} className={`flex-1 py-2.5 text-xs font-black uppercase rounded-lg transition-all ${authMode === 'register' ? 'bg-[#d4af37] text-slate-950' : 'text-slate-400'}`}>Criar Conta</button>
              <button type="button" onClick={() => setAuthMode('login')} className={`flex-1 py-2.5 text-xs font-black uppercase rounded-lg transition-all ${authMode === 'login' ? 'bg-[#d4af37] text-slate-950' : 'text-slate-400'}`}>Entrar</button>
            </div>
          ) : (
            <div className="mb-4 text-center">
              <span className="text-xs bg-red-600/20 text-red-400 font-bold px-3 py-1 rounded-full uppercase">Painel de Acesso ROOT</span>
              <button type="button" onClick={() => setAuthMode('login')} className="text-xs text-slate-400 block mx-auto mt-2 underline">Voltar para Login Comum</button>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4 text-left">
            <div>
              <label className="text-[10px] uppercase font-black text-[#d4af37] block mb-1">Usuário / Nickname</label>
              <input type="text" placeholder="Seu apelido do app" value={usernameInput} onChange={e => setUsernameInput(e.target.value)} className="w-full bg-[#09101d] border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-white" required />
            </div>
            
            {authMode === 'register' && (
              <div>
                <label className="text-[10px] uppercase font-black text-[#d4af37] block mb-1">E-mail (Opcional)</label>
                <input type="email" placeholder="seu@email.com" value={emailInput} onChange={e => setEmailInput(e.target.value)} className="w-full bg-[#09101d] border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-white" />
              </div>
            )}

            <div>
              <label className="text-[10px] uppercase font-black text-[#d4af37] block mb-1">Senha de Acesso</label>
              <input type="password" placeholder="••••••••" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} className="w-full bg-[#09101d] border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-white" required />
            </div>
            
            <button type="submit" className="w-full bg-green-600 font-black py-4 rounded-xl text-xs uppercase tracking-widest hover:bg-green-500">
              {authMode === 'register' ? 'Confirmar Cadastro' : authMode === 'dev' ? 'Acessar Modo ROOT' : 'Entrar no Álbum'}
            </button>
          </form>
        </div>
        <button onClick={() => setAuthMode('dev')} className="absolute bottom-6 right-6 opacity-25 hover:opacity-100 bg-[#13223d] p-3 rounded-full text-sm">🔒</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1626] pb-32 text-slate-100">
      <header className="bg-[#13223d] px-4 py-3 sticky top-0 z-40 flex justify-between items-center shadow-xl border-b-2 border-[#d4af37]">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏆</span>
          <div>
            <h1 className="text-xs font-black uppercase text-white tracking-wider">Troca Figurinhas Pro</h1>
            <p className="text-[9px] text-green-400 font-bold uppercase">@{currentUser}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {currentUser === 'admin' && <button onClick={() => setCurrentTab('dev_panel')} className="bg-red-600 text-white text-[9px] font-black px-2.5 py-1.5 rounded uppercase">⚙️ Menu Dev ROOT</button>}
          <button onClick={() => { localStorage.removeItem('tf_current_user'); window.location.reload(); }} className="text-[10px] font-black text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg">Sair</button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-4 space-y-4">
        
        {/* MEU ÁLBUM */}
        {currentTab === 'album' && (
          <div className="space-y-4">
            <div className="bg-[#13223d] rounded-2xl p-4 border border-slate-800 shadow-xl">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-sm font-black uppercase text-[#d4af37]">Status da Coleção</h3>
                  <p className="text-[10px] text-slate-400">Total de 980 cromos reais</p>
                </div>
                <span className="text-lg font-black text-green-400">{porcentagemProgresso}%</span>
              </div>
              <div className="w-full bg-[#09101d] h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-full rounded-full" style={{ width: `${porcentagemProgresso}%` }}></div>
              </div>
            </div>

            <div className="bg-[#13223d] p-4 rounded-2xl border border-slate-800 space-y-3 shadow-lg">
              <div>
                <label className="text-[10px] uppercase font-black text-[#d4af37] block mb-1.5">📍 Filtrar por Seleção Nacional</label>
                <select value={selectedTeamFilter} onChange={e => setSelectedTeamFilter(e.target.value)} className="w-full bg-[#09101d] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white">
                  {SELECOES_COPA.map(s => <option key={s} value={s}>{s === 'Todas' ? '🌍 Mostrar Todas as Seleções' : `🏳️ ${s}`}</option>)}
                </select>
              </div>
              <input type="text" placeholder="🔍 Buscar por número ou nome..." value={searchFilter} onChange={e => setSearchFilter(e.target.value)} className="w-full bg-[#09101d] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white" />
              <div className="flex gap-1 overflow-x-auto">
                {[{ id: 'all', label: 'Todas' }, { id: 'have', label: 'Tenho' }, { id: 'missing', label: 'Faltando' }, { id: 'repeated', label: 'Repetidas' }].map(f => (
                  <button key={f.id} onClick={() => setSubTabFilter(f.id as any)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border ${subTabFilter === f.id ? 'bg-[#d4af37] text-slate-950' : 'bg-[#09101d]'}`}>{f.label}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {cromosFiltrados.slice(0, 80).map(sticker => {
                const isFlipped = flippedCardId === sticker.id;
                return (
                  <div key={sticker.id} className="h-48 perspective">
                    <div className={`relative w-full h-full duration-300 transform-style rounded-xl cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`} onClick={() => setFlippedCardId(isFlipped ? null : sticker.id)}>
                      <div className={`absolute inset-0 backface-hidden rounded-xl border-2 p-2.5 flex flex-col justify-between ${sticker.quantity > 0 ? 'bg-gradient-to-b from-[#1a3159] to-[#13223d] border-[#d4af37]' : 'bg-[#18253c]/40 border-slate-800'}`}>
                        <span className="text-[9px] font-mono font-black text-[#d4af37] bg-[#09101d] px-1.5 py-0.5 rounded w-max">{sticker.number}</span>
                        <div className="text-center">
                          <p className="text-xs font-black text-white truncate">{sticker.player_name}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase">{sticker.team}</p>
                        </div>
                        <div className="flex justify-between items-center border-t border-slate-700/40 pt-1.5">
                          <span className="text-[8px] text-slate-400 font-bold">{sticker.position}</span>
                          <div className="bg-green-600 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center">{sticker.quantity}</div>
                        </div>
                      </div>
                      <div className={`absolute inset-0 rounded-xl p-3 flex flex-col justify-between text-center bg-[#09101d] border-2 border-[#d4af37] transform rotate-y-180 ${isFlipped ? 'z-10' : 'z-0 pointer-events-none opacity-0'}`} onClick={e => e.stopPropagation()}>
                        <p className="text-xs font-black text-white mt-1">{sticker.player_name}</p>
                        <p className="text-[10px] text-slate-400">ID Master: {sticker.id}</p>
                        <div className="flex gap-1 mt-2">
                          <button onClick={() => alterarQuantidadeCromo(sticker.id, -1)} className="flex-1 bg-red-600 text-white text-xs font-black py-2 rounded-lg">- 1</button>
                          <button onClick={() => alterarQuantidadeCromo(sticker.id, 1)} className="flex-1 bg-green-600 text-white text-xs font-black py-2 rounded-lg">+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CHAT E AMIZADES */}
        {currentTab === 'social' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#13223d] p-4 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-xs font-black text-[#d4af37] uppercase">👥 Amigos e Solicitações</h3>
              <form onSubmit={enviarPedidoAmizade} className="flex gap-1">
                <input type="text" placeholder="Buscar username..." value={friendSearchInput} onChange={e => setFriendSearchInput(e.target.value)} className="flex-1 bg-[#09101d] text-xs p-2.5 rounded-xl text-white" />
                <button type="submit" className="bg-blue-600 text-white font-black text-xs px-3 rounded-xl">+</button>
              </form>

              {dbUsers[currentUser]?.friendRequests?.length > 0 && (
                <div className="bg-[#09101d] p-2 rounded-xl border border-yellow-500/30 space-y-2">
                  {dbUsers[currentUser].friendRequests.map(req => (
                    <div key={req} className="flex justify-between items-center text-xs">
                      <span>@{req}</span>
                      <div className="flex gap-1">
                        <button onClick={() => responderPedidoAmizade(req, true)} className="bg-green-600 px-2 py-0.5 rounded">V</button>
                        <button onClick={() => responderPedidoAmizade(req, false)} className="bg-red-600 px-2 py-0.5 rounded">X</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-1">
                <button onClick={() => setActiveChatTarget('GLOBAL')} className={`w-full text-left p-2.5 rounded-xl text-xs font-black ${activeChatTarget === 'GLOBAL' ? 'bg-[#d4af37] text-slate-950' : 'bg-[#09101d]'}`}>🌍 Chat Global Público</button>
                {dbUsers[currentUser]?.friends?.map(fName => (
                  <button key={fName} onClick={() => setActiveChatTarget(fName)} className={`w-full text-left p-2.5 rounded-xl text-xs ${activeChatTarget === fName ? 'bg-blue-600 text-white' : 'bg-[#09101d]'}`}>💬 @{fName}</button>
                ))}
              </div>
            </div>

            <div className="bg-[#13223d] p-4 rounded-2xl border border-slate-800 flex flex-col h-[400px] md:col-span-2 justify-between">
              <h3 className="text-xs font-black text-[#d4af37] uppercase border-b border-slate-800 pb-2">💬 Chat: {activeChatTarget}</h3>
              <div className="flex-1 overflow-y-auto my-3 p-2 bg-[#09101d] rounded-xl space-y-2">
                {mensagensVisiveis.map(m => (
                  <div key={m.id} className={`p-2 rounded-xl max-w-[80%] text-xs ${m.sender === currentUser ? 'bg-blue-600/30 ml-auto' : 'bg-slate-800'}`}>
                    <span className="text-[9px] font-black text-[#d4af37]">@{m.sender}:</span>
                    <p className="text-white mt-0.5">{m.text}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={enviarMensagemChat} className="flex gap-2">
                <input type="text" placeholder="Digite sua mensagem..." value={typedMessage} onChange={e => setTypedMessage(e.target.value)} className="flex-1 bg-[#09101d] border border-slate-700 rounded-xl px-3 text-xs text-white" />
                <button type="submit" className="bg-green-600 text-white font-black px-4 py-2 text-xs rounded-xl">Enviar</button>
              </form>
            </div>
          </div>
        )}

        {/* TAB CALENDÁRIO GERAL DE JOGOS */}
        {currentTab === 'jogos' && (
          <div className="bg-[#13223d] rounded-2xl p-4 border border-slate-800">
            <h2 className="text-base font-black text-[#d4af37] mb-4 uppercase">⚽ Tabela de Jogos Copa 2026</h2>
            <div className="space-y-2">
              {dbMatches.map(match => (
                <div key={match.id} className="bg-[#09101d] p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div className="w-1/3 text-right font-black text-sm">{match.team1}</div>
                  <div className="flex flex-col items-center justify-center bg-[#13223d] px-4 py-2 rounded-xl border border-slate-700">
                    <span className="text-yellow-400 font-mono font-black text-lg">
                      {match.status === 'SCHEDULED' ? 'vs' : `${match.score1} - ${match.score2}`}
                    </span>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded mt-1 ${match.status === 'LIVE' ? 'bg-red-600 text-white animate-pulse' : match.status === 'FINISHED' ? 'bg-slate-700 text-slate-300' : 'bg-blue-900 text-blue-200'}`}>
                      {match.status === 'LIVE' ? 'AO VIVO' : match.status === 'FINISHED' ? 'ENCERRADO' : 'AGENDADO'}
                    </span>
                  </div>
                  <div className="w-1/3 text-left font-black text-sm">{match.team2}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================
            PAINEL SUPREMO DO DESENVOLVEDOR (ROOT CONTROLS)
            ========================================== */}
        {currentTab === 'dev_panel' && currentUser === 'admin' && (
          <div className="space-y-6 bg-[#0a111f] p-5 rounded-3xl border border-red-500/40 shadow-2xl">
            <h2 className="text-base font-black text-red-500 uppercase tracking-widest">⚙️ Console Administrador Supremo (ROOT)</h2>
            
            {/* INJETOR MANUAL E ESPECÍFICO DE QUALQUER FIGURINHA */}
            <div className="bg-[#13223d] p-4 rounded-xl space-y-3 border border-slate-800">
              <h3 className="text-xs font-black text-green-400 uppercase">🔥 Injetor Seletivo de Figurinhas</h3>
              <form onSubmit={devInjetarFigurinhaEspecifica} className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <select value={selectedDevTargetUser} onChange={e => setSelectedDevTargetUser(e.target.value)} className="bg-[#09101d] border border-slate-700 text-xs p-2.5 rounded-lg text-white" required>
                  <option value="">-- Selecione o Usuário --</option>
                  {Object.keys(dbUsers).map(uname => <option key={uname} value={uname}>@{uname}</option>)}
                </select>
                <input type="text" placeholder="ID (1-980) ou Código (ex: BRA 01)" value={devStickerIdInput} onChange={e => setDevStickerIdInput(e.target.value)} className="bg-[#09101d] text-xs p-2.5 rounded-lg text-white placeholder-slate-500 border border-slate-700" required />
                <input type="number" placeholder="Quantidade" value={devStickerQtyInput} onChange={e => setDevStickerQtyInput(e.target.value)} className="bg-[#09101d] text-xs p-2.5 rounded-lg text-white border border-slate-700" min="1" required />
                <button type="submit" className="bg-green-600 text-white font-black text-xs rounded-lg uppercase hover:bg-green-500">Injetar Item</button>
              </form>
            </div>

            {/* GERENCIADOR E MODIFICADOR DE JOGOS EXISTENTES - ATUALIZADO */}
            <div className="bg-[#13223d] p-4 rounded-xl space-y-3 border border-slate-800">
              <h3 className="text-xs font-black text-[#d4af37] uppercase">⚽ Modificador de Jogos, Times e Deletar Partidas</h3>
              
              {/* Criar Novo Jogo */}
              <div className="border-b border-slate-800 pb-3">
                <p className="text-[10px] uppercase font-black text-slate-400 mb-1.5">Criar Nova Partida:</p>
                <div className="flex gap-2">
                  <input type="text" placeholder="Time 1 (Ex: Brasil 🇧🇷)" value={matchTeam1} onChange={e => setMatchTeam1(e.target.value)} className="bg-[#09101d] text-xs p-2 rounded-lg flex-1 text-white border border-slate-800" />
                  <input type="text" placeholder="Time 2 (Ex: Itália 🇮🇹)" value={matchTeam2} onChange={e => setMatchTeam2(e.target.value)} className="bg-[#09101d] text-xs p-2 rounded-lg flex-1 text-white border border-slate-800" />
                  <button onClick={devAdicionarJogo} className="bg-blue-600 text-xs px-4 rounded-lg font-black uppercase">Criar Jogo</button>
                </div>
              </div>

              {/* Lista para Edição de Placar/Status/Nomes */}
              <div className="space-y-2 pt-2">
                <p className="text-[10px] uppercase font-black text-slate-400">Gerenciar Partidas Criadas:</p>
                {dbMatches.map(m => (
                  <div key={m.id} className="bg-[#09101d] p-3 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white">{m.team1} vs {m.team2}</span>
                      <span className="text-[#d4af37] font-mono">{m.status === 'SCHEDULED' ? 'Agendado' : `${m.score1}x${m.score2} (${m.status})`}</span>
                    </div>

                    {editingMatchId === m.id ? (
                      <div className="space-y-3 bg-[#13223d] p-3 rounded border border-slate-700">
                        {/* NOVO: Alterar o nome dos times ativos */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] text-slate-400 font-bold block uppercase">Nome Time 1:</label>
                            <input type="text" className="w-full bg-[#09101d] text-xs p-2 rounded text-white border border-slate-700" value={editTeam1} onChange={e => setEditTeam1(e.target.value)} />
                          </div>
                          <div>
                            <label className="text-[9px] text-slate-400 font-bold block uppercase">Nome Time 2:</label>
                            <input type="text" className="w-full bg-[#09101d] text-xs p-2 rounded text-white border border-slate-700" value={editTeam2} onChange={e => setEditTeam2(e.target.value)} />
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 items-center pt-1">
                          <div className="flex items-center gap-1">
                            <label className="text-[10px] text-slate-400">Gols T1:</label>
                            <input type="number" className="w-12 bg-[#09101d] text-xs p-1 rounded" value={editScore1} onChange={e => setEditScore1(e.target.value)} />
                          </div>
                          <div className="flex items-center gap-1">
                            <label className="text-[10px] text-slate-400">Gols T2:</label>
                            <input type="number" className="w-12 bg-[#09101d] text-xs p-1 rounded" value={editScore2} onChange={e => setEditScore2(e.target.value)} />
                          </div>
                          <select className="bg-[#09101d] text-xs p-1 rounded text-white" value={editStatus} onChange={e => setEditStatus(e.target.value as any)}>
                            <option value="SCHEDULED">Agendado</option>
                            <option value="LIVE">Ao Vivo</option>
                            <option value="FINISHED">Encerrado</option>
                          </select>
                          
                          <div className="flex gap-1 ml-auto w-full sm:w-auto pt-2 sm:pt-0">
                            <button onClick={() => devSalvarEdicaoJogo(m.id)} className="bg-green-600 px-3 py-1.5 rounded text-[10px] font-black uppercase">Salvar Dados</button>
                            {/* NOVO: Botão de deletar partida permanentemente */}
                            <button onClick={() => devDeletarJogo(m.id)} className="bg-red-600 px-3 py-1.5 rounded text-[10px] font-black uppercase">Deletar Jogo</button>
                            <button onClick={() => setEditingMatchId(null)} className="text-slate-400 text-[10px] underline ml-1">Sair</button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => {
                        setEditingMatchId(m.id);
                        setEditTeam1(m.team1);
                        setEditTeam2(m.team2);
                        setEditScore1(String(m.score1 || 0));
                        setEditScore2(String(m.score2 || 0));
                        setEditStatus(m.status);
                      }} className="bg-amber-600/20 text-amber-400 text-[10px] font-black px-2.5 py-1.5 rounded uppercase border border-amber-500/30 hover:bg-amber-600/40">
                        ✏️ Editar Times, Placar ou Deletar Partida
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* GERENCIAMENTO DE CONTAS SECUNDÁRIAS */}
            <div className="bg-[#13223d] p-4 rounded-xl space-y-3 border border-slate-800">
              <h3 className="text-xs font-black text-red-500 uppercase">3. Gerenciar Contas Existentes</h3>
              <form onSubmit={devCriarUsuarioManualmente} className="flex gap-2">
                <input type="text" placeholder="Criar conta rápida..." value={devUserSearch} onChange={e => setDevUserSearch(e.target.value)} className="flex-1 bg-[#09101d] text-xs p-2.5 rounded-lg text-white" />
                <button type="submit" className="bg-purple-600 px-4 text-xs font-black rounded-lg">Criar</button>
              </form>
              <div className="space-y-1">
                {Object.values(dbUsers).map(u => (
                  <div key={u.id} className="bg-[#09101d] p-2 rounded flex justify-between items-center text-xs">
                    <span>@{u.username} ({Object.keys(u.album).length} tipos de cartas)</span>
                    <button onClick={() => devDeletarUsuario(u.username)} className="bg-red-600 text-white text-[10px] px-2 py-1 rounded">Deletar</button>
                  </div>
                ))}
              </div>
            </div>

            {/* TERMINAL LOGS */}
            <div className="bg-[#13223d] p-4 rounded-xl">
              <h3 className="text-xs font-black text-white uppercase mb-2">💾 Terminal Logs</h3>
              <div className="bg-[#09101d] font-mono p-3 rounded text-[10px] space-y-1 max-h-24 overflow-y-auto">
                {dbLogs.map(log => <p key={log.id} className="text-blue-400">[{log.timestamp}] {log.message}</p>)}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* FOOTER NAVEGAÇÃO */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#13223d] border-t-2 border-[#d4af37]/40 py-3 flex justify-around items-center z-40 shadow-2xl">
        <button onClick={() => setCurrentTab('album')} className={`flex flex-col items-center flex-1 ${currentTab === 'album' ? 'text-[#d4af37] font-black' : 'text-slate-400'}`}>
          <span className="text-xl">📖</span><span className="text-[9px] uppercase tracking-wider">Álbum</span>
        </button>
        <button onClick={() => setCurrentTab('social')} className={`flex flex-col items-center flex-1 ${currentTab === 'social' ? 'text-[#d4af37] font-black' : 'text-slate-400'}`}>
          <span className="text-xl">💬</span><span className="text-[9px] uppercase tracking-wider">Chat / Amigos</span>
        </button>
        <button onClick={() => setCurrentTab('jogos')} className={`flex flex-col items-center flex-1 ${currentTab === 'jogos' ? 'text-[#d4af37] font-black' : 'text-slate-400'}`}>
          <span className="text-xl">⚽</span><span className="text-[9px] uppercase tracking-wider">Jogos</span>
        </button>
        <button onClick={() => { if(currentUser === 'admin') setCurrentTab('dev_panel'); else alert('Acesso Root Restrito.'); }} className={`flex flex-col items-center flex-1 ${currentTab === 'dev_panel' ? 'text-[#d4af37] font-black' : 'text-slate-400'}`}>
          <span className="text-xl">⚙️</span><span className="text-[9px] uppercase tracking-wider">Dev ROOT</span>
        </button>
      </div>

    </div>
  );
}