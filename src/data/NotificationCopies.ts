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

    // Generic/Random (Expanded to 100+)
    generic: [
        // Perguntas & Curiosidade
        { title: 'Cosmo', body: 'Qual foi a última vez que vocês riram juntos hoje?' },
        { title: 'Cosmo', body: 'Diga algo que você admira no seu parceiro agora.' },
        { title: 'Cosmo', body: 'Um novo card diário está esperando por vocês.' },
        { title: 'Cosmo', body: 'O que te faz sentir mais amado(a) hoje?' },
        { title: 'Cosmo', body: 'Respirem fundo e façam uma pergunta um ao outro.' },
        { title: 'Cosmo', body: 'O Cosmo tem uma surpresa em forma de pergunta para vocês.' },
        { title: 'Cosmo', body: 'Como foi o melhor momento do dia do seu amor?' },
        { title: 'Cosmo', body: 'Qual o sonho que vocês querem realizar juntos este ano?' },
        { title: 'Cosmo', body: 'O Cosmo quer saber: qual a música de vocês hoje?' },
        { title: 'Cosmo', body: 'Ouse perguntar algo que nunca perguntou.' },
        
        // Afirmação & Carinho
        { title: 'Cosmo', body: 'Um pequeno ritual hoje garante um amor forte amanhã.' },
        { title: 'Cosmo', body: 'Menos tela, mais olho no olho. Comece pelo Cosmo.' },
        { title: 'Cosmo', body: 'O silêncio é bom, mas uma boa conversa é melhor.' },
        { title: 'Cosmo', body: 'Lembrete: Você é a pessoa favorita de alguém.' },
        { title: 'Cosmo', body: 'A gratidão é o combustível do Cosmo. Agradeça por algo hoje.' },
        { title: 'Cosmo', body: 'Tire 2 minutos para se conectar de verdade.' },
        { title: 'Cosmo', body: 'Vocês formam uma bela constelação juntos.' },
        { title: 'Cosmo', body: 'O Cosmo está calmo... agitado... como está o coração de vocês?' },
        { title: 'Cosmo', body: 'Não é sobre o tempo que vocês têm, mas como usam.' },
        { title: 'Cosmo', body: 'Vocês são parceiros de jornada. Falem sobre isso.' },
        { title: 'Cosmo', body: 'O amor é um exercício diário. Vamos treinar?' },
        { title: 'Cosmo', body: 'Seu relacionamento merece esse momento de pausa.' },
        { title: 'Cosmo', body: 'Que tal um elogio sincero agora?' },
        { title: 'Cosmo', body: 'O dia passa rápido. O amor fica. Conectem-se.' },
        { title: 'Cosmo', body: 'Uma pergunta pode mudar o rumo da noite.' },

        // Desafio & Ação
        { title: 'Desafio Relâmpago', body: 'Dê um beijo de 10 segundos no seu amor agora.' },
        { title: 'Ação do Dia', body: 'Envie uma foto antiga de vocês dois com a legenda "Te amo".' },
        { title: 'Cosmo', body: 'Faça um carinho surpresa enquanto conversam sobre o card de hoje.' },
        { title: 'Cosmo', body: 'Hoje é dia de ouvir com atenção plena. Prontos?' },
        { title: 'Cosmo', body: 'Desliguem a TV por 5 minutos. O show é vocês.' },
        { title: 'Cosmo', body: 'Toque físico libera ocitocina. Abra o Cosmo abraçados.' },
        { title: 'Cosmo', body: 'Olhem nos olhos um do outro por 1 minuto antes de abrir o app.' },

        // Reflexão Profunda
        { title: 'Cosmo', body: 'O que vocês aprenderam um com o outro essa semana?' },
        { title: 'Cosmo', body: 'Qual memória vocês querem criar hoje?' },
        { title: 'Cosmo', body: 'O que falta para o dia de vocês ser perfeito?' },
        { title: 'Cosmo', body: 'Como vocês podem se apoiar melhor amanhã?' },
        { title: 'Cosmo', body: 'Qual a "liguagem do amor" que vocês mais usaram hoje?' },
        { title: 'Cosmo', body: 'Existe algo não dito que precisa ser falado com carinho?' },
        { title: 'Cosmo', body: 'Transforme o ordinário em extraordinário com uma conversa.' },

        // Playful & Fun
        { title: 'Cosmo', body: 'Se vocês fossem um filme, qual gênero seria hoje?' },
        { title: 'Cosmo', body: 'Quem vai fazer o jantar? Decidam no Jo-Ken-Po do Cosmo.' },
        { title: 'Cosmo', body: 'Qual a fofoca do dia? O Cosmo quer saber (e seu amor também).' },
        { title: 'Cosmo', body: 'Rir juntos é o melhor remédio. Busquem o card "Divertido".' },
        { title: 'Cosmo', body: 'Duvido vocês não sorrirem com a pergunta de hoje.' },

        // More Variations to reach 100+
        { title: 'Cosmo', body: 'O amor cresce onde é regado. Regue o seu agora.' },
        { title: 'Cosmo', body: 'Pequenos momentos constroem grandes histórias.' },
        { title: 'Cosmo', body: 'Você já disse "eu te amo" hoje? Diga com uma pergunta.' },
        { title: 'Cosmo', body: 'A felicidade é feita de instantes compartilhados.' },
        { title: 'Cosmo', body: 'O que vocês vão agradecer antes de dormir?' },
        { title: 'Cosmo', body: 'Sua relação é seu maior projeto. Dedique tempo a ela.' },
        { title: 'Cosmo', body: 'Conexão real em um mundo digital. Isso é Cosmo.' },
        { title: 'Cosmo', body: 'Não deixem para amanhã o carinho que podem dar hoje.' },
        { title: 'Cosmo', body: 'O melhor lugar do mundo é um abraço. E uma boa conversa.' },
        { title: 'Cosmo', body: 'Vocês são um time. Façam o check-in do dia.' },
        { title: 'Cosmo', body: 'Qual foi a vitória do dia? Celebrem juntos.' },
        { title: 'Cosmo', body: 'Seu amor teve um dia difícil? Seja o porto seguro.' },
        { title: 'Cosmo', body: 'A pergunta certa abre portas no coração.' },
        { title: 'Cosmo', body: 'Invistam na conta bancária emocional de vocês hoje.' },
        { title: 'Cosmo', body: 'O Cosmo é o terapeuta de bolso (e grátis). Aproveitem.' },
        { title: 'Cosmo', body: 'Descubram algo novo sobre quem vocês amam.' },
        { title: 'Cosmo', body: 'A curiosidade mantém a chama acesa. Sejam curiosos.' },
        { title: 'Cosmo', body: 'Não seja apenas um colega de quarto. Seja um amante.' },
        { title: 'Cosmo', body: 'A rotina é inimiga da paixão. Quebre a rotina agora.' },
        { title: 'Cosmo', body: 'Surpreenda seu amor com uma resposta inesperada.' },
        { title: 'Cosmo', body: 'O que vocês fariam se não tivessem medo?' },
        { title: 'Cosmo', body: 'Qual o superpoder do seu relacionamento?' },
        { title: 'Cosmo', body: 'Hoje é um bom dia para perdoar e seguir em frente.' },
        { title: 'Cosmo', body: 'Faça do seu relacionamento um lugar de paz.' },
        { title: 'Cosmo', body: 'O Cosmo está convidando para um encontro no sofá.' },
        { title: 'Cosmo', body: 'Desligue o Wi-Fi e ligue o Coração-Fi.' },
        { title: 'Cosmo', body: 'Vocês estão construindo um legado de amor. Continue.' },
        { title: 'Cosmo', body: 'A intimidade mora nos detalhes.' },
        { title: 'Cosmo', body: 'Qual a cor do humor de vocês hoje?' },
        { title: 'Cosmo', body: 'Um minuto de atenção vale mais que mil presentes.' },
        { title: 'Cosmo', body: 'Seu amor esperando por você. Não o deixe esperando.' },
        { title: 'Cosmo', body: 'Qual a aventura de hoje? Pode ser no sofá da sala.' },
        { title: 'Cosmo', body: 'Amar é um verbo. Pratiquem a ação de amar.' },
        { title: 'Cosmo', body: 'O que de melhor aconteceu pra nós hoje?' },
        { title: 'Cosmo', body: 'Troquem um segredo.' },
        { title: 'Cosmo', body: 'Lembram do primeiro encontro? Falem sobre isso.' },
        { title: 'Cosmo', body: 'Qual a meta da semana? Alinhem as bússolas.' },
        { title: 'Cosmo', body: 'Quem ama, cuida. Quem cuida, conversa.' },
        { title: 'Cosmo', body: 'O segredo da felicidade? Atenção plena.' },
        { title: 'Cosmo', body: 'Hoje é o dia perfeito para um recomeço.' },
        { title: 'Cosmo', body: 'Seu relacionamento é um jardim. Vamos cuidar?' },
        { title: 'Cosmo', body: 'A vida é curta demais para conversas rasas.' },
        { title: 'Cosmo', body: 'Mergulhem fundo hoje. O Cosmo ajuda.' },
        { title: 'Cosmo', body: 'Qual o sabor do dia de hoje?' },
        { title: 'Cosmo', body: 'Façam um brinde à vida (mesmo que com água).' },
        { title: 'Cosmo', body: 'O que vocês fariam diferente se começassem hoje?' },
        { title: 'Cosmo', body: 'Agradeçam por terem um ao outro.' },
        { title: 'Cosmo', body: 'O amor é a resposta. Qual foi a pergunta?' },
        { title: 'Cosmo', body: 'Vamos criar uma nova tradição hoje?' },
        { title: 'Cosmo', body: 'O que faz seu coração bater mais forte?' },
        { title: 'Cosmo', body: 'O Cosmo previu: altas chances de amor hoje.' },
        { title: 'Cosmo', body: 'Sejam a melhor parte do dia um do outro.' },
        
        // Final Batch (Reaching 100+)
        { title: 'Cosmo', body: 'O que te fez sorrir hoje? Compartilhe.' },
        { title: 'Cosmo', body: 'E se vocês planejassem uma viagem hoje à noite?' },
        { title: 'Cosmo', body: 'Um elogio inesperado muda tudo. Experimente.' },
        { title: 'Cosmo', body: 'Qual a melhor qualidade do seu parceiro?' },
        { title: 'Cosmo', body: 'Lembrete: O amor é paciente e gentil.' },
        { title: 'Cosmo', body: 'Hoje é dia de namorar. Mesmo que em casa.' },
        { title: 'Cosmo', body: 'Façam uma lista de gratidão juntos.' },
        { title: 'Cosmo', body: 'Qual foi o ponto alto da semana até agora?' },
        { title: 'Cosmo', body: 'O Cosmo sugere: 5 minutos de carinho sem falar nada.' },
        { title: 'Cosmo', body: 'Você se sente ouvido(a)? Conversem sobre isso.' },
        { title: 'Cosmo', body: 'Qual o "eu te amo" mais bonito que já ouviram?' },
        { title: 'Cosmo', body: 'O que vocês admiravam um no outro quando se conheceram?' },
        { title: 'Cosmo', body: 'A beleza está nos olhos de quem ama. O que você vê?' },
        { title: 'Cosmo', body: 'Hoje, escolha amar deliberadamente.' },
        { title: 'Cosmo', body: 'O estresse fica fora de casa. O amor entra.' },
        { title: 'Cosmo', body: 'Uma massagem rápida nos ombros? O Cosmo aprova.' },
        { title: 'Cosmo', body: 'Que tal cozinharem juntos ouvindo música hoje?' },
        { title: 'Cosmo', body: 'Leiam o horóscopo um do outro (ou só riam disso).' },
        { title: 'Cosmo', body: 'Qual a prioridade número 1 do casal agora?' },
        { title: 'Cosmo', body: 'Como vocês lidam com as diferenças? Com amor.' },
        { title: 'Cosmo', body: 'O que você faria para ver seu amor sorrir agora?' },
        { title: 'Cosmo', body: 'Fechem os olhos e lembrem de um dia perfeito.' },
        { title: 'Cosmo', body: 'O Cosmo é o lembrete que o amor precisa.' },
        { title: 'Cosmo', body: 'Seu relacionamento é um refúgio. Cuidem dele.' },
        { title: 'Cosmo', body: 'Palavras têm poder. Usem para abençoar.' },
        { title: 'Cosmo', body: 'Qual o "inside joke" favorito de vocês?' },
        { title: 'Cosmo', body: 'Hoje é um bom dia para dizer "obrigado por existir".' },
        { title: 'Cosmo', body: 'O amor não reclama, o amor age. Ajam hoje.' },
        { title: 'Cosmo', body: 'O Cosmo pergunta: Vocês estão felizes?' },
        { title: 'Cosmo', body: 'A resposta para tudo é o amor. Qual a pergunta?' }
    ]
};
