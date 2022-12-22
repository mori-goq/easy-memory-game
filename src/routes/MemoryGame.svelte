
<script lang="ts">
  import { flip } from 'svelte/animate'
  import arrayShuffle from 'array-shuffle'

  import imageBack from '$lib/images/back.png'

  import { cardList as originalCardList } from './card'
  import { useTimer } from './useTimer'

  const SHUFFLE_DURATION = 500
  const SHUFFLE_COUNT = 3

  const { time, timeStart, timeStop, timeReset } = useTimer()

  let cardList = originalCardList
  let missCount = 0
  let isLockCard = true
  let isGameStart = false

  // ゲームスタート
  async function gameStart() {
    isGameStart = true

    // シャッフル
    for (let _ of [...new Array(SHUFFLE_COUNT)]) {
      cardList = arrayShuffle(cardList)
      // シャッフルの動作を待つ
      await new Promise(resolve => setTimeout(resolve, SHUFFLE_DURATION + 200))
    }

    // 全てのカードを伏せる
    cardList = cardList.map((card) => ({ ...card, isMatch: false }))
    isLockCard = false

    // 時間をカウント
    timeStart()
  }

  // リセット
  function reset() {
    timeReset()

    cardList = originalCardList
    missCount = 0
    isLockCard = true
    isGameStart = false
  }

  // カードをクリック
  async function handleClickCard(id: number) {
    // 全てのカードを押せなくする
    isLockCard = true

    // クリックしたカードを返す
    cardList = cardList.map((card) => {
      return {
        ...card,
        isChecked: card.isChecked || card.id === id,
      }
    })

    const checkedCardList = cardList.filter((card) => card.isChecked)

    // クリックしたカードが１枚目の場合、リターン
    if (checkedCardList.length === 1) {
      isLockCard = false
      return
    }

    // 絵柄が異なる場合、元に戻す
    if (checkedCardList[0].imageSrc !== checkedCardList[1].imageSrc) {
      missCount += 1

      // 絵柄が異なることを表示するまで待つ
      await new Promise(resolve => setTimeout(resolve, 1000))

      cardList = cardList.map((card) => ({ ...card, isChecked: false }))
      isLockCard = false
      return
    }

    // 絵柄が同じ場合、マッチした判定にする
    cardList = cardList.map((card) => {
      return {
        ...card,
        isChecked: false,
        isMatch: card.isMatch || card.isChecked
      }
    })

    const isMatchAll = cardList.every((card) => card.isMatch)

    // 全ての絵柄が揃ってない場合、リターン
    if (!isMatchAll) {
      isLockCard = false
      return
    }

    //　絵柄が揃ったことを表示するまで待つ
    await new Promise(resolve => setTimeout(resolve, 200))

    timeStop()
    alert('クリア')
  }
</script>

<div class="pt-5">
  <div class="mb-3 box">
    <h1 class="mb-3 is-size-4">やさしい神経衰弱</h1>
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <div>
        <button
          class="button is-primary"
          on:click={gameStart}
          disabled={isGameStart}
        >
          ゲームスタート
        </button>
        <button
          class="button is-danger is-outlined"
          on:click={reset}
          disabled={$time === 0}
        >
          リセット
        </button>
      </div>
      <div>
        <p class="mb-0 is-size-5">時間: {$time}秒　ミス回数: {missCount}</p>
      </div>
    </div>
  </div>

  <div class="box card-board">
    {#each cardList as card (card.id)}
      <div animate:flip="{{ duration: SHUFFLE_DURATION }}">
        <button
          type="button"
          class="mb-0 button card-button"
          data-is-front={card.isChecked || card.isMatch}
          disabled={isLockCard || card.isChecked || card.isMatch}
          on:click={() => handleClickCard(card.id)}
        >
          <img src={card.imageSrc} class="card-image" alt="#" />
          <img src={imageBack} class="card-image" alt="#" />
        </button>
      </div>
    {/each}
  </div>
</div>

<style>
  .card-board {
    display: grid;
    grid-template-columns: repeat(4, auto);
    gap: 10px;
  }

  .card-button {
    width: 120px;
    height: 120px;
    transition: all 0.2s;
    transform-style: preserve-3d;
  }

  .card-button[data-is-front="true"] {
    transform: rotateY(180deg);
  }

  .card-button:disabled {
    opacity: 1;
  }

  .card-image {
    position: absolute;
    backface-visibility: hidden;
  }

  .card-image:first-of-type {
    transform: rotateY(180deg);
  }
</style>
