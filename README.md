# Resgate Orbital

Trabalho Pratico 2 - Phaser 3  
Tecnologias Multimedia 2025/2026

## Elementos do grupo

- Nome: Jorge Costa | Numero: 31400

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
- - Sistema de som misto: musica de fundo em formato comprimido (MP3) e efeitos de eventos sintetizados atraves de Web Audio.
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
