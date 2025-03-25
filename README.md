📂 src/
 ├── 📂 app/                
 │   ├── 📂 core/          # Serviços globais e configurações
 │   │   ├── interceptors/ # Interceptadores HTTP
 │   │   ├── guards/       # Guards de autenticação e autorização
 │   │   ├── services/     # Serviços globais (ex: autenticação)
 │   │   ├── index.ts      # Exportações globais
 │   │   └── ...
 │   ├── 📂 shared/        # Componentes reutilizáveis, pipes e diretivas
 │   │   ├── components/   # Ex: botões, modais (agora standalone)
 │   │   ├── directives/   
 │   │   ├── pipes/       
 │   │   ├── index.ts      # Exportações de componentes standalone
 │   │   └── ...
 │   ├── 📂 features/      # Funcionalidades principais
 │   │   ├── 📂 auth/      # Autenticação
 │   │   │    ├── login.component.ts (Standalone)
 │   │   │    ├── services/
 │   │   ├── 📂 dashboard/  # Painel principal
 │   │   ├── 📂 settings/   # Configurações do usuário
 │   │   └── ...
 │   ├── app.component.ts  # Agora standalone
 │   ├── app.routes.ts     # Rotas centralizadas
 ├── 📂 assets/            # Imagens, fontes, etc.
 ├── 📂 environments/      # Configurações de ambiente
 ├── main.ts               # Inicialização do app com bootstrapApplication
 ├── index.html           
 ├── styles.scss          
 ├── angular.json         
 ├── package.json        
 └── tsconfig.json        
