# Barbearia - Site Institucional

## Sobre o Projeto

Este é um site institucional para uma barbearia, desenvolvido com HTML, CSS e JavaScript. O site inclui páginas de início, sobre, agendamento, galeria e contato.

## Recursos Implementados

- Design responsivo para todos os dispositivos
- Acessibilidade (ARIA, contraste, navegação por teclado)
- Otimização de SEO com meta tags
- Galeria de trabalhos com filtros
- Sistema de agendamento
- Formulário de contato
- Otimização de imagens (lazy loading e WebP)

## Estrutura do Projeto

```
barbearia/
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── img/
│   │   ├── gallery/
│   │   └── ...
│   └── js/
│       ├── script.js
│       └── image-optimizer.js
├── scripts/
│   └── convert-images.js
├── index.html
├── sobre.html
├── agendamento.html
├── galeria.html
├── contato.html
└── README.md
```

## Otimização de Imagens

O projeto inclui recursos para otimização de imagens:

### 1. Lazy Loading

As imagens são carregadas apenas quando entram no viewport, economizando largura de banda e melhorando o tempo de carregamento da página. Isso é implementado através do script `image-optimizer.js`.

### 2. Formato WebP

O site suporta o formato WebP, que oferece melhor compressão e qualidade em comparação com JPEG e PNG. O script detecta automaticamente o suporte do navegador e carrega as imagens WebP quando disponíveis.

### 3. Imagens Responsivas

O site utiliza diferentes tamanhos de imagens para diferentes dispositivos, garantindo que os usuários móveis não precisem baixar imagens grandes desnecessariamente.

## Scripts de Otimização de Imagens

O projeto inclui scripts Node.js para otimizar imagens:

### Converter Imagens para WebP

1. Instale o Node.js (https://nodejs.org/)
2. Navegue até a pasta `scripts` no terminal
3. Instale as dependências: `npm install`
4. Execute o script: `npm run convert`

O script irá:
- Converter todas as imagens JPG e PNG para WebP
- Criar versões em diferentes tamanhos (pequeno, médio, grande)
- Manter a estrutura de diretórios original

### Otimizar Imagens Existentes

Para otimizar as imagens existentes sem alterar o formato:

1. Navegue até a pasta `scripts` no terminal
2. Execute o script: `npm run optimize`

O script irá:
- Otimizar todas as imagens JPG, PNG e WebP
- Reduzir o tamanho dos arquivos mantendo a qualidade visual
- Salvar as imagens otimizadas na pasta `assets/img/optimized`
- Exibir um relatório com a economia de espaço para cada imagem

## Implementação do Lazy Loading

Para adicionar lazy loading a novas imagens:

1. Use o atributo `data-src` em vez de `src` para o caminho da imagem
2. Adicione `data-webp` com o caminho para a versão WebP da imagem
3. Adicione o atributo `loading="lazy"` para suporte nativo do navegador

Exemplo:

```html
<img data-src="assets/img/exemplo.jpg" 
     data-webp="assets/img/exemplo.webp" 
     alt="Descrição da imagem" 
     width="300" height="300" 
     loading="lazy">
```

## Acessibilidade

O site segue as diretrizes WCAG para acessibilidade:

- Atributos ARIA para melhor navegação com leitores de tela
- Contraste de cores adequado para usuários com deficiência visual
- Navegação completa por teclado
- Textos alternativos para imagens
- Estrutura semântica HTML5

## SEO

O site inclui otimizações para mecanismos de busca:

- Meta tags descritivas
- Propriedades Open Graph para compartilhamento em redes sociais
- URLs amigáveis
- Estrutura de cabeçalhos adequada (H1, H2, H3)
- Sitemap XML