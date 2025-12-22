# Prompt de Implementação: Funcionalidade Elos

Copie e cole este prompt no seu agente de IA para iniciar a implementação:

---

Você é um engenheiro Flutter responsável por implementar a funcionalidade “Elos” no app mobile (Flutter, iOS-first). O conteúdo já existe localmente em JSON na pasta /dicas-data/ (assets). Implemente a feature completa: item no menu, telas, parsing de JSON, persistência de progresso, favoritos e compartilhamento.

1) Requisitos principais
	1.	Criar um item “Elos” no bottom navigation do app.
	2.	Implementar 3 telas:
	•	ElosHomeScreen: lista de Elos (categorias) com progresso e botão “Continuar/Começar”.
	•	EloDetailScreen: detalhes de um Elo + lista progressiva de artigos (com tempo de leitura e status).
	•	EloArticleScreen: leitura do artigo com renderização por blocos + sessões finais obrigatórias (“O que você aprendeu” e “Como exercitar”) + ações (Concluir, Salvar, Compartilhar).
	3.	Conteúdo offline: carregar JSONs via rootBundle.loadString a partir de assets.
	4.	Persistência local (MVP): usar SharedPreferences para:
	•	artigos lidos por Elo (set/list)
	•	último artigo acessado por Elo
	•	favoritos (set/list)
	5.	Progressão:
	•	“Continuar” abre o próximo artigo não lido pelo campo ordem.
	•	O usuário pode reler artigos já lidos.
	•	Ao concluir todos, o Elo fica como “Concluído”.
	6.	Compartilhamento: usar share_plus para compartilhar texto (título + 2–3 bullets do que aprendeu + 1 exercício).
	7.	Sem emojis na UI, usar ícones do Material.

2) Estrutura de dados (assumida)

Cada arquivo JSON segue a estrutura:
	•	elo (id, titulo, descricao_curta, para_quem, objetivo, ordem, versao)
	•	artigos[] (id, ordem, titulo, subtitulo, tempo_medio_leitura_min, nivel, tags[], blocos[], o_que_voce_aprendeu[], como_exercitar[])

Implemente models:
	•	EloCategory
	•	EloArticle
	•	EloBlock (tipo, titulo, conteudo[])

3) Arquitetura sugerida (simples e limpa)
	•	/lib/features/elos/
	•	data/elos_repository.dart (carrega e faz cache dos JSONs)
	•	models/
	•	state/elos_controller.dart (ChangeNotifier ou Riverpod, conforme o app já usa)
	•	ui/ (3 screens + widgets)
	•	Deixe claro no código onde adicionar os 8 arquivos (lista de asset paths).

4) UI/UX
	•	ElosHome: cards com título, descrição curta, “para quem”, barra de progresso, CTA.
	•	EloDetail: header com objetivo, lista de artigos; destacar “Próximo recomendado”.
	•	Article: tipografia confortável, seções bem separadas, listas com bullets, botões no final:
	•	Concluir/Desmarcar (toggle)
	•	Salvar (toggle)
	•	Compartilhar
	•	Estados vazios e de erro: mensagens curtas e acionáveis.

5) Integração com assets
	•	Atualize pubspec.yaml para incluir:
	•	assets/dicas-data/ (ou o path real do projeto; se já existir, não duplicar)
	•	Garanta que o app compile e que o carregamento funcione sem internet.

6) Persistência (chaves)

Use chaves com prefixo elos_:
	•	elos_read_<eloId> => lista de articleIds
	•	elos_last_<eloId> => articleId
	•	elos_fav => lista de articleIds (globais)

7) Entregáveis
	•	Código implementado
	•	Breve README no final da resposta descrevendo:
	•	onde ficam os assets
	•	como adicionar um novo Elo/arquivo JSON
	•	como funciona o cálculo de progresso e “Continuar”
	•	como testar manualmente
