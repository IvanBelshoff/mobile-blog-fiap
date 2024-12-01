# Mobile Blog - FIAP 📱📝

Um projeto mobile desenvolvido em React Native para gerenciar um blog, permitindo criar, editar e visualizar postagens.

## 📝 Descrição do Projeto

Este projeto é uma aplicação mobile desenvolvida como parte dos estudos na FIAP. A aplicação simula um sistema de blog que inclui funcionalidades como criação de postagens, edição, gerenciamento de temas (modo claro/escuro), e muito mais.

### Principais Funcionalidades:
- Criação e edição de postagens com título, conteúdo e imagem de capa.
- Alternância entre temas claro e escuro.
- Gerenciamento de visibilidade das postagens.
- Utilização do Expo para desenvolvimento rápido e multiplataforma.

---

## 📱 Telas do Sistema

### **Home**
- **Página Inicial**  
  **URL:** `/`

---

### **Postagens**
- **Criar Postagens**  
  **URL:** `/posts/private/new`

- **Editar Postagens**  
  **URL:** `/posts/private/detail/(id do post)`

- **Visualizar Detalhes de Postagens**  
  **URL:** `/posts/public/detail/(id do post)`

---

### **Usuários**
- **Criar Usuários**  
  **URL:** `/users/new`

- **Editar Usuários**  
  **URL:** `/users/detail/(id do usuario)`

- **Visualizar Usuários**  
  **URL:** `/users`

---

### **Minha Conta**
- **URL:** `/profile`

---

### **Configurações**
- **URL:** `/settings`


---

## 🚀 Como Rodar o Projeto

### Pré-requisitos:
Certifique-se de ter as seguintes ferramentas instaladas:
- [Node.js](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Um dispositivo físico ou emulador configurado.
- Backend: https://github.com/IvanBelshoff/backend-blog-fiap

### Passo a passo:

1. **Clone este repositório:**
   ```bash
   git clone https://github.com/IvanBelshoff/mobile-blog-fiap.git

2. **Navegue até o diretório do projeto:**
   ```bash
   cd mobile-blog-fiap

3. **Instale as dependências:**
   ```bash
   npm install

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npx expo start

5. **Execute o aplicativo em um dispositivo físico ou emulador:**
   - Escaneie o QR code no terminal usando o aplicativo Expo Go (disponível na App Store e Google Play).
   - Ou utilize um emulador Android/iOS configurado.

## 🛠️ Tecnologias Utilizadas

- **React Native**: Framework para desenvolvimento mobile.
- **Expo**: Ferramenta para desenvolvimento ágil.
- **Axios**: Gerenciamento de requisições HTTP.
- **React Navigation**: Navegação entre telas.
- **TypeScript**: Para maior segurança no código.
