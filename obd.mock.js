let speedValue = 0
let rpmValue = 800
let tempValue = 0
let mafValue = 0
let iatValue = -40

setInterval(() => {
  console.log(JSON.stringify({ name: "vss", value: speedValue++ }))
  console.log(JSON.stringify({ name: "rpm", value: rpmValue }))
  console.log(JSON.stringify({ name: "temp", value: tempValue++ }))
  console.log(JSON.stringify({ name: "maf", value: mafValue }))
  console.log(JSON.stringify({ name: "iat", value: iatValue++ }))
  rpmValue += 100
  mafValue += .1

  if (speedValue > 200) speedValue = 0
  if (rpmValue > 9000) rpmValue = 800
  if (tempValue > 100) tempValue = -40
  if (mafValue > 20) mafValue = 0
  if (iatValue > 100) iatValue = -40
}, 1000)
