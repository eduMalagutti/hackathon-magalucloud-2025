 Configuração ESLint

Este projeto está configurado com ESLint para React + TypeScript com as regras mais utilizadas.

## Plugins Instalados

- **eslint-plugin-react**: Regras específicas para React
- **eslint-plugin-react-hooks**: Regras para React Hooks
- **eslint-plugin-jsx-a11y**: Regras de acessibilidade para JSX
- **@typescript-eslint**: Regras específicas para TypeScript

## Regras Principais

### React
- `react/jsx-uses-react`: Evita marcação incorreta de React como não utilizado
- `react/jsx-uses-vars`: Evita marcação incorreta de variáveis JSX como não utilizadas
- `react/prop-types`: Desabilitado (usamos TypeScript)
- `react/react-in-jsx-scope`: Desabilitado (não necessário no React 17+)
- `react/jsx-pascal-case`: Força PascalCase para componentes
- `react/self-closing-comp`: Força tags auto-fechadas quando possível

### TypeScript
- `@typescript-eslint/no-unused-vars`: Evita variáveis não utilizadas
- `@typescript-eslint/no-explicit-any`: Avisa sobre uso de `any`
- `@typescript-eslint/no-var-requires`: Evita `require()` em TypeScript
- `@typescript-eslint/no-non-null-assertion`: Avisa sobre `!` (non-null assertion)

### React Hooks
- `react-hooks/rules-of-hooks`: Força regras dos Hooks
- `react-hooks/exhaustive-deps`: Avisa sobre dependências missing no useEffect

### Acessibilidade
- `jsx-a11y/alt-text`: Força texto alternativo em imagens
- `jsx-a11y/anchor-is-valid`: Valida links
- `jsx-a11y/aria-props`: Valida propriedades ARIA

### Gerais
- `no-console`: Avisa sobre console.log
- `no-debugger`: Erro para debugger statements
- `prefer-const`: Força uso de const quando possível
- `eqeqeq`: Força uso de === em vez de ==

## Scripts Disponíveis

```bash
# Verificar código sem corrigir
npm run lint:check

# Verificar e corrigir automaticamente
npm run lint:fix

# Executar lint (padrão com max warnings 0)
npm run lint
```

## Arquivos Ignorados

O ESLint ignora automaticamente:
- `dist/**/*` - Arquivos de build
- `node_modules/**/*` - Dependências
- `*.config.*` - Arquivos de configuração

## Notas

- O warning sobre `document.getElementById('root')!` no `main.tsx` é esperado e comum em projetos Vite
- A configuração usa ESLint v9 com flat config format
- Todas as regras foram escolhidas com base nas práticas mais comuns da comunidade React/TypeScript