import db from "../db"
import { API_URL, HUB_URL, LANDING_URL, PORTAL_URL } from "../routes/config"

export default function initializer() {
  const head = ` ${'TASK'.black}${'BOARD'.cyan} ${'API'.magenta} `.bgWhite + ' ONLINE '.green.bgBlack
  console.clear()
  db.connect().then(() => {
    console.group(head)
    console.log(`->`.green, 'Connection to database successful'.blue, `<`.green)
    console.log(`-> ${` LANDING `.bgBlue}     ${LANDING_URL}`.blue);
    console.log(`-> ${` HUB `.bgCyan}         ${HUB_URL}`.cyan)
    console.log(`-> ${` PORTAL `.bgWhite}      ${PORTAL_URL}`.white)
    console.log(`-> ${` API `.bgMagenta}         ${API_URL}`.magenta)
    console.groupEnd()
  })


  

}