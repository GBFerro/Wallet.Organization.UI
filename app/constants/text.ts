export const TEXT = {
	appName: "Monexo",
	appVersion: "FinForecast v1.0.0",

	nav: {
		forecast: "Previsao",
		transactions: "Transacoes",
		settings: "Ajustes",
	},

	auth: {
		loginTitle: "Faca login para continuar",
		registerTitle: "Criar Conta",
		registerSubtitle: "Preencha os dados para comecar",
		emailLabel: "Email",
		emailPlaceholder: "seu@email.com",
		passwordLabel: "Senha",
		passwordPlaceholder: "Sua senha",
		confirmPasswordLabel: "Confirmar Senha",
		confirmPasswordPlaceholder: "Digite sua senha novamente",
		nameLabel: "Nome",
		namePlaceholder: "Seu nome completo",
		loginButton: "Entrar",
		registerButton: "Criar Conta",
		haveAccount: "Ja tem uma conta?",
		noAccount: "Nao tem uma conta?",
		signIn: "Fazer Login",
		signUp: "Cadastrar-se",
		errorFillFields: "Preencha todos os campos",
		errorPasswordMismatch: "As senhas nao conferem",
		errorPasswordLength: "A senha deve ter pelo menos 6 caracteres",
		errorLogin: "Erro ao fazer login",
		errorRegister: "Erro ao criar conta",
	},

	settings: {
		title: "Ajustes",
		defaultUser: "Usuario",
		defaultEmail: "usuario@email.com",

		// Sections
		sectionAccount: "CONTA",
		sectionPreferences: "PREFERENCIAS",
		sectionSupport: "SUPORTE",
		sectionSession: "SESSAO",

		// Account Items
		profile: "Perfil",
		profileSubtitle: "Editar informacoes pessoais",
		notifications: "Notificacoes",
		notificationsSubtitle: "Configurar alertas",
		security: "Seguranca",
		securitySubtitle: "Senha e autenticacao",

		// Preferences
		currency: "Moeda",
		currencySubtitle: "BRL - Real Brasileiro",
		darkMode: "Modo Escuro",
		darkModeOn: "Ativado",
		darkModeOff: "Desativado",
		language: "Idioma",
		languageSubtitle: "Portugues (Brasil)",

		// Support
		help: "Ajuda",
		helpSubtitle: "Perguntas frequentes",
		contact: "Contato",
		contactSubtitle: "Fale conosco",
		terms: "Termos de Uso",
		privacy: "Politica de Privacidade",

		// Session
		logout: "Sair",
		deleteAccount: "Excluir Conta",

		// Alerts
		logoutConfirmTitle: "Sair",
		logoutConfirmMessage: "Deseja sair da sua conta?",
		deleteConfirmTitle: "Excluir Conta",
		deleteConfirmMessage:
			"Tem certeza que deseja excluir sua conta? Esta acao nao pode ser desfeita.",
		cancel: "Cancelar",
		confirmLogout: "Sair",
		confirmDelete: "Excluir",
	},

	transactions: {
		title: "Transacoes",
		searchPlaceholder: "Buscar transacoes...",
		loading: "Carregando transacoes...",
		errorLoad: "Erro ao carregar transacoes",
		emptyTitle: "Nenhuma transacao encontrada",
		emptyMessage: "Adicione sua primeira transacao",
		addButton: "Nova Transacao",
	},

	forecast: {
		title: "FinForecast",
		loading: "Carregando previsao...",
		errorLoad: "Erro ao carregar previsao",
	},

	common: {
		loading: "Carregando...",
		error: "Erro",
		success: "Sucesso",
		save: "Salvar",
		cancel: "Cancelar",
		delete: "Excluir",
		edit: "Editar",
		add: "Adicionar",
		search: "Buscar",
		filter: "Filtrar",
		close: "Fechar",
		ok: "OK",
		yes: "Sim",
		no: "Nao",
	},

	errors: {
		network: "Erro de conexao",
		unknown: "Erro desconhecido",
		timeout: "Tempo de espera excedido",
		unauthorized: "Nao autorizado",
		notFound: "Nao encontrado",
		serverError: "Erro no servidor",
	},
} as const;

export type TextKeys = typeof TEXT;
