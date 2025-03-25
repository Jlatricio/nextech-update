📂 src/
 ├── 📂 app/                  # Módulos, componentes e serviços principais
 │   ├── 📂 core/             # Serviços globais e configurações essenciais
 │   │   ├── interceptors/    # Interceptadores de requisição HTTP
 │   │   ├── guards/          # Guards para controle de acesso
 │   │   ├── services/        # Serviços compartilhados
 │   │   ├── state/           # Gerenciamento de estado global (se necessário)
 │   │   ├── core.module.ts   # Módulo principal do Core
 │   │   ├── index.ts         # Exportações globais do Core
 │   │   └── ...
 │   ├── 📂 shared/           # Componentes e diretivas reutilizáveis
 │   │   ├── components/      # Componentes comuns (botões, modais, etc.)
 │   │   ├── directives/      # Diretivas reutilizáveis
 │   │   ├── pipes/           # Pipes compartilhados
 │   │   ├── shared.module.ts # Módulo do Shared
 │   │   ├── index.ts         # Exportações globais do Shared
 │   │   └── ...
 │   ├── 📂 features/         # Módulos por funcionalidade (Lazy Loading)
 │   │   ├── 📂 auth/         # Autenticação (login, registro, etc.)
 │   │   │   ├── 📂 components/  # Componentes específicos
 │   │   │   ├── auth.module.ts  # Módulo de autenticação
 │   │   │   ├── auth.routes.ts  # Rotas do módulo de autenticação
 │   │   │   ├── index.ts        # Exportações globais
 │   │   │   └── ...
 │   │   ├── 📂 dashboard/     # Painel principal
 │   │   │   ├── 📂 components/ # Componentes específicos
 │   │   │   ├── dashboard.module.ts
 │   │   │   ├── dashboard.routes.ts
 │   │   │   ├── index.ts
 │   │   │   └── ...
 │   │   ├── 📂 settings/      # Configurações do usuário
 │   │   │   ├── 📂 components/ # Componentes específicos
 │   │   │   ├── settings.module.ts
 │   │   │   ├── settings.routes.ts
 │   │   │   ├── index.ts
 │   │   │   └── ...
 │   │   └── ...
 │   ├── app.component.ts    # Componente raiz do Angular
 │   ├── app.module.ts       # Módulo principal do Angular
 │   ├── app.routes.ts       # Definição das rotas principais
 │   └── index.ts            # Exportações globais do App
 ├── 📂 assets/              # Imagens, ícones, fontes e outros recursos
 ├── 📂 environments/        # Configurações de ambiente (dev, prod)
 ├── main.ts                 # Arquivo de bootstrap do Angular
 ├── index.html              # Arquivo HTML principal
 ├── styles.scss             # Estilos globais
 ├── angular.json            # Configuração do Angular CLI
 ├── package.json            # Dependências do projeto
 └── tsconfig.json           # Configuração do TypeScript
