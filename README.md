# 🐾 Zeludi — Cuidados Inteligentes e Gestão Preventiva de Pets

> **Conceito:** Cada pet é único. Cada cuidado importa.  
> Plataforma digital para tutores e cuidadores de cães, gatos, aves, coelhos, roedores e outras espécies, unindo ciência do bem-estar animal, análise meteorológica em tempo real e prontuário médico preventivo.

---

## 🎨 Identidade Visual

- **Verde-sálvia:** `#829B83`
- **Verde-escuro (Floresta):** `#354A3D`
- **Creme:** `#F5F1E8`
- **Areia:** `#DCCBB5`
- **Branco:** `#FFFFFF`

---

## 🚀 Tecnologias

- **Framework:** Next.js 16 (App Router com Partial Prerendering)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS v4 + Design Tokens
- **Autenticação & Backend:** Supabase Auth + Supabase PostgreSQL
- **Segurança:** Row Level Security (RLS) em todas as tabelas
- **APIs Externas:** Open-Meteo (Meteorologia em tempo real sem dependência de chaves pagas)
- **Ícones:** Lucide React

---

## 📁 Estrutura do Projeto

```
zeludi/
├── src/
│   ├── app/                    # Rotas do App Router
│   │   ├── ai/                 # Zeludi IA Assistente
│   │   ├── api/ai/chat/        # Rota de servidor para IA com filtro de emergências
│   │   ├── dashboard/          # Painel Principal com clima e rotinas
│   │   ├── food/               # Guia de Nutrição & Toxicidade verificada
│   │   ├── health/             # Calendário de Vacinas & Imunização
│   │   ├── login/ & register/  # Autenticação com termos LGPD
│   │   ├── pets/               # Catálogo de pets e busca
│   │   │   ├── [id]/           # Dossiê individual (Ficha, Saúde, Dieta, Clima)
│   │   │   └── new/            # Assistente progressivo de cadastro
│   │   ├── profile/            # Perfil do tutor e LGPD
│   │   ├── sos/                # Botão de emergência 24h e geolocalização
│   │   └── weather/            # Módulo Zeludi Clima detalhado
│   ├── components/layout/      # Navbar, Footer e componentes globais
│   ├── context/                # AuthContext com suporte Supabase + Demonstração
│   ├── lib/supabase/           # Clientes Supabase (Browser, Server, Middleware)
│   ├── services/               # Serviços de Pets, Tarefas, Clima e Nutrição
│   └── types/                  # Tipagem estrita Database e entidades
└── supabase/
    └── migrations/             # Migração SQL com RLS e base inicial
```

---

## 🛠️ Como Executar Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/carolzinh427-beep/zeludi.git
   cd zeludi
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Copie `.env.example` para `.env.local` e insira suas credenciais do Supabase:
   ```bash
   cp .env.example .env.local
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse [http://localhost:3000](http://localhost:3000).

---

## ☁️ Deploy no Vercel

1. Importe o repositório `https://github.com/carolzinh427-beep/zeludi` no dashboard do **Vercel**.
2. Configure as seguintes variáveis de ambiente no projeto Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (opcional no build)
   - `GEMINI_API_KEY` ou `OPENAI_API_KEY` (para ativação da Zeludi IA em produção)
3. Clique em **Deploy**. O Next.js detectará automaticamente a configuração do App Router e completará o deploy.

---

## 📄 Licença e Termos

Desenvolvido para a plataforma Zeludi. As orientações possuem finalidade estritamente preventiva e educativa, não substituindo o atendimento presencial de um médico-veterinário registrado no CRMV.
