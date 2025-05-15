
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
=======
# NextechFrontendMain

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
>>>>>>> minha-nova-feature
