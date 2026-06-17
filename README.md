# Resgate Orbital

Trabalho Pratico 2 - Phaser 3  
Tecnologias Multimedia 2025/2026

## Elementos do grupo

- Nome:Jorge Costa | Numero:31400

## Versao de Phaser

- Phaser: 3.87.0
- Inclusao: npm, com Vite como servidor local e ferramenta de build.

## Descricao do jogo

**Resgate Orbital** e um jogo 2D top-down de recolha e sobrevivencia. O jogador controla uma nave de resgate que deve recolher nucleos de energia enquanto evita meteoros e drones. A dificuldade aumenta progressivamente com a pontuacao: surgem mais obstaculos, os inimigos ficam mais rapidos e a janela de erro torna-se menor.

Objetivo: recolher 12 nucleos de energia antes de perder as 3 vidas.

Funcionalidades implementadas:

- Multiplas cenas: arranque, carregamento, menu, jogo e ecra final.
- Jogador controlado por teclado e rato.
- Fisica Arcade com grupos, velocidades, colisao com limites do mundo e overlaps.
- Pontuacao, vidas, progresso do objetivo e cooldown visiveis no HUD.
- Condicoes de vitoria e game over com reinicio.
- Suporte multilingue PT/EN com ficheiros JSON dedicados.
- Efeitos sonoros gerados por Web Audio durante eventos do jogo.
- Dificuldade progressiva, particulas, camera shake e tweens.

## Controlos

- WASD ou Setas: mover a nave.
- Espaco: disparar pulso na ultima direcao de movimento.
- Clique do rato: disparar pulso na direcao do ponteiro.
- R: reiniciar no ecra final.
- M: regressar ao menu no ecra final.
- Botao PT/EN: alternar idioma.

## Como executar

Requisito recomendado: Node.js 20.19 ou superior.

```bash
npm install
npm start
```

Depois abrir o endereco indicado pelo Vite, normalmente:

```text
http://127.0.0.1:5173/
```

Para gerar a versao final:

```bash
npm run build
```

## Aspectos multimedia

As imagens estao em `public/assets/images/` e foram criadas especificamente para este trabalho em SVG leve. As resolucoes sao proporcionais ao uso em jogo:

- `ship.svg` - nave do jogador, 64x64.
- `meteor.svg` - obstaculo principal, 52x52.
- `drone.svg` - inimigo perseguidor, 48x48.
- `core.svg` - item recolhivel, 40x40.
- `pulse.svg` - projetil/efeito de pulso, 28x28.
- `starfield.svg` - fundo do jogo, carregado a 1280x720.

Os sons sao sintetizados em tempo real com Web Audio atraves de `src/utils/sfx.js`. Esta opcao evita ficheiros WAV longos ou assets de audio sobredimensionados, mantendo efeitos curtos para recolha, dano, disparo, vitoria e derrota.

O total de assets e pequeno e nao existem ficheiros nao usados no projeto.

## Estrutura

```text
jogo2d/
+-- index.html
+-- package.json
+-- README.md
+-- public/
|   +-- assets/
|       +-- images/
+-- src/
    +-- i18n/
    +-- scenes/
    +-- utils/
    +-- main.js
    +-- styles.css
```

## Entrega

Antes da entrega final, substituir os dados dos elementos do grupo no README, criar o repositorio GitHub e marcar a versao entregue com a tag:

```bash
git tag 1.0
git push origin 1.0
```
