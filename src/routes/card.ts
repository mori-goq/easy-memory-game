import image01 from '$lib/images/01.png'
import image02 from '$lib/images/02.png'
import image03 from '$lib/images/03.png'
import image04 from '$lib/images/04.png'
import image05 from '$lib/images/05.png'
import image06 from '$lib/images/06.png'
import image07 from '$lib/images/07.png'
import image08 from '$lib/images/08.png'

const imageList = [
  image01,
  image02,
  image03,
  image04,
  image05,
  image06,
  image07,
  image08,
]

const cardList = imageList
  // 2枚ずつに
  .flatMap((imageSrc) => ([imageSrc, imageSrc]))
  .map((imageSrc, index) => {
    return {
      id: index + 1,
      imageSrc,
      isChecked: false,
      isMatch: true,
    }
  })

export { cardList }
