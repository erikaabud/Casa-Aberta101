# Modelos 3D do painel AR

Salve nesta pasta os arquivos `.glb` ou `.gltf` usados no painel de realidade aumentada com marcador `hiro`.

## Estrutura sugerida

- `floresta_sombria/semente-ancestral.glb`
- `deserto_ardente/coracao-solar.glb`
- `montanhas_geladas/fragmento-glacial.glb`

## Como vincular um modelo

O vínculo entre território, missão e item coletável está no arquivo:

- `src/dados/artefatosAr.js`

Cada território possui:

- `missaoId`: missão relacionada ao artefato
- `item`: item que vai para o inventário ao clicar em `Coletar`
- `modelo.caminho`: caminho público do arquivo 3D

Exemplo:

```js
modelo: {
  caminho: '/modelos-3d/floresta_sombria/semente-ancestral.glb',
  escala: '0.45 0.45 0.45',
  posicao: '0 0.35 0',
  rotacao: '0 0 0',
}
```

Se o arquivo 3D ainda não existir, o sistema exibe um objeto geométrico de fallback até você salvar o modelo real nesta pasta.
