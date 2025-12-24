export interface NotificationTemplate {
    title: string;
    body: string;
}

export const NOTIFICATION_COPIES = {
    // Phase 1: The Spark (Days 01-10)
    streakIntro: [
        { title: 'Cosmo', body: '2 dias de conexão! O começo de algo lindo. Vamos manter o ritmo?' },
        { title: 'Cosmo', body: '3 dias seguidos. Vocês estão criando um ritual de verdade. Continue!' },
        { title: 'Cosmo', body: 'O Cosmo está se expandindo! 4 dias. Que tal um card novo hoje?' },
        { title: 'Cosmo', body: '5 dias! O amor está adorando essa atenção extra. Não pare agora.' },
        { title: 'Cosmo', body: 'Quase uma semana de conexão diária. O que vocês descobriram hoje?' },
        { title: 'Cosmo', body: 'UMA SEMANA! 🎉 Badge "Pequena Estrela" desbloqueada. Prontos para a próxima?' },
        { title: 'Cosmo', body: '8 dias. O hábito está se formando. Conecte-se rapidinho hoje.' },
        { title: 'Cosmo', body: '9 dias. Não deixe a rotina apagar o que vocês construíram até aqui.' },
        { title: 'Cosmo', body: '10 DIAS! Seu Cosmo está brilhando intensamente. Vamos celebrar?' },
    ],

    // Phase 2: The Core (Days 11-30)
    streakCore: [
        { title: 'Cosmo', body: '11 dias. Mais do que um app, é o tempo de vocês. Estão prontos?' },
        { title: 'Cosmo', body: '12 dias. A cada card, vocês se conhecem melhor. Qual o de hoje?' },
        { title: 'Cosmo', body: '13 dias. Amanhã tem marco! Garanta sua sequência agora.' },
        { title: 'Cosmo', body: 'DUAS SEMANAS! 🏆 Novos elos liberados. Vá fundo hoje.' },
        { title: 'Cosmo', body: '15 dias. Metade do mês com 100% de presença. Incrível.' },
        { title: 'Cosmo', body: '16 dias. O amor está nos detalhes (e nos cards do Cosmo).' },
        { title: 'Cosmo', body: '17 dias. Não deixe o cansaço vencer o carinho. 1 minuto e pronto.' },
        { title: 'Cosmo', body: '18 dias. A conexão de vocês é prioridade. Vamos dar um check?' },
        { title: 'Cosmo', body: '19 dias. O nível do Cosmo é só um número, mas o que ele representa é tudo.' },
        { title: 'Cosmo', body: '20 DIAS! Vinte motivos para sorrir com o seu amor hoje.' },
    ],

    // Milestones
    milestones: {
        '30': { title: 'Cosmo', body: '30 DIAS: UM MÊS DE COSMO! 🌟 O Ritual agora é sagrado.' },
        '50': { title: 'Cosmo', body: '50 DIAS! Meio centenário de conversas incríveis. Qual o segredo?' },
        '100': { title: 'Cosmo', body: '100 DIAS! 💯 Status: Conexão Inabalável. Vocês são o exemplo.' },
    },

    // Day of the Week
    seasonal: {
        friday: [
            { title: 'Aqueça a noite 🔥', body: 'Chegou o final de semana. Que tal um card de "Romance" para abrir a noite?' },
            { title: 'Cosmo', body: 'Sextou! Reserve 5 minutos para uma conversa profunda hoje.' },
        ],
        saturday: [
            { title: 'Café com Cosmo ☕', body: 'Escolha um card "Divertido" para lerem juntos enquanto o café passa.' },
            { title: 'Cosmo', body: 'Sábado é dia de criar memórias. Vamos ver o que o Cosmo sugere?' },
        ],
        sunday: [
            { title: 'Preparando o coração', body: 'A semana vai começar. Use o Cosmo hoje para um momento de apoio e presença real.' },
            { title: 'Cosmo', body: 'Domingo à noite é perfeito para planejar o futuro. Que tal um card?' },
        ],
        wednesday: [
            { title: 'Meio da semana', body: 'Mande um card de gratidão para o seu amor agora. Um pequeno gesto muda o dia.' },
        ]
    },

    // Loss Aversion / Retention
    retention: [
        { title: 'Atenção ⚠️', body: 'Seu Cosmo de X dias está piscando... Conecte-se agora para não apagar.' },
        { title: 'Não deixe apagar!', body: 'Amanhã o contador volta ao zero... Não deixe o ritual de hoje passar.' },
        { title: 'Saudade', body: 'Faz tempo que vocês não expandem o Cosmo. Que tal 1 minuto hoje?' },
        { title: 'Conexão', body: 'O amor da sua vida está te esperando no Cosmo. 30 segundos?' },
        { title: 'Cosmo', body: 'Parece que hoje a rotina venceu. Última chance de salvar seu nível de conexão!' },
    ],

    // Random generic (to complete 50+)
    generic: [
        { title: 'Cosmo', body: 'Qual foi a última vez que vocês riram juntos hoje?' },
        { title: 'Cosmo', body: 'Diga algo que você admira no seu parceiro agora.' },
        { title: 'Cosmo', body: 'Um novo card diário está esperando por vocês.' },
        { title: 'Cosmo', body: 'O que te faz sentir mais amado(a) hoje?' },
        { title: 'Cosmo', body: 'Respirem fundo e façam uma pergunta um ao outro.' },
        { title: 'Cosmo', body: 'O Cosmo tem uma surpresa em forma de pergunta para vocês.' },
        { title: 'Cosmo', body: 'Como foi o melhor momento do dia do seu amor?' },
        { title: 'Cosmo', body: 'Um pequeno ritual hoje garante um amor forte amanhã.' },
        { title: 'Cosmo', body: 'Menos tela, mais olho no olho. Comece pelo Cosmo.' },
        { title: 'Cosmo', body: 'Qual o sonho que vocês querem realizar juntos este ano?' },
        { title: 'Cosmo', body: 'O silêncio é bom, mas uma boa conversa é melhor.' },
        { title: 'Cosmo', body: 'Lembrete: Você é a pessoa favorita de alguém.' },
        { title: 'Cosmo', body: 'O Cosmo quer saber: qual a música de vocês hoje?' },
        { title: 'Cosmo', body: 'Ouse perguntar algo que nunca perguntou.' },
        { title: 'Cosmo', body: 'A gratidão é o combustível do Cosmo. Agradeça por algo hoje.' },
        { title: 'Cosmo', body: 'Tire 2 minutos para se conectar de verdade.' },
        { title: 'Cosmo', body: 'Vocês formam uma bela constelação juntos.' },
        { title: 'Cosmo', body: 'O Cosmo está calmo... agitado... como está o coração de vocês?' },
        { title: 'Cosmo', body: 'Não é sobre o tempo que vocês têm, mas como usam.' },
        { title: 'Cosmo', body: 'Vocês são parceiros de jornada. Falem sobre isso.' },
        { title: 'Cosmo', body: 'O amor é um exercício diário. Vamos treinar?' },
    ]
};
