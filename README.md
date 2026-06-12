# Shadow Tyrant para Netlify

Esta pasta e uma versao independente do projeto original em PHP. O visual e os
assets foram preservados, mas a aplicacao agora usa:

- HTML, CSS e JavaScript estaticos na Netlify;
- Supabase Auth para cadastro, login e troca de senha;
- Supabase PostgreSQL para perfil, personagens e progresso;
- Supabase Storage para fotos de perfil;
- Netlify Function em TypeScript para registrar partidas.

## 1. Criar o Supabase

1. Crie um projeto em <https://supabase.com>.
2. Abra `SQL Editor`.
3. Na primeira configuracao, execute todo o arquivo
   `supabase/primeira-instalacao.sql`. Ele nao possui comandos `DROP` e evita
   o alerta de operacoes destrutivas do editor.
4. Em `Authentication > URL Configuration`, informe a URL da Netlify.
5. Copie `Project URL`, a chave `anon` e a chave `service_role`.

Nunca coloque a chave `service_role` em arquivos dentro de `site/`.

## 2. Publicar na Netlify

1. Envie a pasta `shadow-tyrant-netlify` para um repositorio Git.
2. Na Netlify, importe esse repositorio.
3. O arquivo `netlify.toml` ja configura build, pasta publicada e Functions.
4. Cadastre estas variaveis em `Project configuration > Environment variables`:

```text
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

5. Execute o deploy.

O comando de build cria `site/assets/js/runtime-config.js` usando somente a URL
e a chave publica `anon`. A chave administrativa fica disponivel apenas para a
Function.

## 3. Desenvolvimento local

Requer Node.js 20 ou superior.

```bash
npm install
npm run build
npx netlify dev
```

Crie um arquivo `.env` baseado em `.env.example` antes de iniciar.

## Atualizar as telas

O projeto PHP original continua intacto na pasta anterior. Depois de alterar
uma tela PHP ou um asset, regenere a copia estatica:

```bash
npm run generate
npm run build
npm run check
```

Se alterar `supabase/schema.sql`, regenere tambem o SQL de primeira instalacao:

```bash
npm run schema:first-install
```

O gerador converte links `.php` para `.html` e mantem os arquivos especificos
da versao Netlify.

## Estado da migracao

Funcionam com Supabase:

- cadastro, login, logout e protecao das paginas;
- dados do perfil e foto;
- troca de senha;
- personagem ativo;
- progresso do evento;
- conclusao de partida e recompensa em moedas.

Loja, skins, inventario, equipamentos e preferencias continuam usando
`localStorage`, como ja acontecia em grande parte do projeto PHP. Isso permite
publicar e jogar agora; a persistencia desses itens entre dispositivos pode ser
movida para novas tabelas do Supabase em uma segunda etapa.
