function iconSelector(data) {
  const type = data.get("type");
  const title = data.get("title");
  const shape = data.get("shape");
  const status = data.get("status");
  const need_action = data.get("need_action");
  const confirmed = data.get("confirmed");
  const contradiction = data.get("contradiction");
  
  let prefix = "stone";
  if (type.match(/地蔵/)) {
    prefix = "jizo";
  } else if (type.match(/菩薩/) || type.match(/その他石仏/) || type.match(/石仏群/)) {
    prefix = "bosatsu";
  } else if (type.match(/如来/)) {
    prefix = "nyorai";
  } else if (type.match(/明王/)) {
    prefix = "myooh";
  } else if (type.match(/天部/)) {
    if (title.match(/([弁辨][財才]?|吉祥)天/)) {
      prefix = "ten_female";
    } else {
      prefix = "ten_male";
    }
  } else if (type.match(/小神社/)) {
    prefix = "shrine";
  } else if (type.match(/小祠/)) {
    prefix = "hokora";
  } else if (type.match(/石祠/)) {
    prefix = "sekishi";
  } else if (type.match(/石(神|塚)/)) {
    prefix = "sekijin";
  } else if (type.match(/(野神|神木)/)) {
    prefix = "tree";
  } else if (type.match(/庚申/)) {
    if (title.match(/青面/) || shape.match(/青面/)) {
      prefix = "shomen";
    } else {
      prefix = "koshin";
    }
  } else if (type.match(/青面金剛/)) {
    prefix = "shomen";
  } else if (type.match(/馬頭観音/)) {
    prefix = "bato";
  } else if (type.match(/月待塔/)) {
    prefix = "tsukimachi";
  } else if (type.match(/如意輪観音/)) {
    prefix = "nyoirin";
  } else if (type.match(/道標/)) {
    prefix = "dohyo";
  } else if (type.match(/標石/)) {
    prefix = "stone_display";
  } else if (type.match(/道祖神/)) {
    prefix = "dosojin";
  } else if (type.match(/(顕彰|戦争)碑/)) {
    prefix = "chukonhi";
  } else if (type.match(/(句歌|供養|記念)碑/)) {
    prefix = "kinenhi";
  } else if (type.match(/供養塔/)) {
    prefix = "kuyohi";
  } else if (type.match(/(名号|題目)/)) {
    prefix = "myogo";
  } else if (type.match(/浮彫五輪塔/)) {
    prefix = "ukibori_gorin";
  } else if (type.match(/富士講/)) {
    prefix = "fujiko";
  } else if (type.match(/(湯殿山|大峰講|山岳信仰)/)) {
    prefix = "mount";
  } else if (type.match(/宝篋印塔/)) {
    prefix = "hokyoin";
  } else if (type.match(/五輪塔/)) {
    prefix = "gorinto";
  } else if (type.match(/板碑/)) {
    prefix = "itahi";
  } else if (type.match(/墓碑/)) {
    prefix = "tomb";
  } else if (type.match(/板碑/)) {
    prefix = "itahi";
  } else if (type.match(/(甲子|巳待|日待)塔/)) {
    prefix = "himachi";
  } else if (type.match(/石塔/)) {
    prefix = "stone_tower";
  } else if (type.match(/碑/)) {
    prefix = "kinenhi";
  }
  if (status && status.match(/消失/)) {
    prefix = `${prefix}_missing`;
  } else if (need_action || !confirmed || contradiction){
    prefix = `${prefix}_action`;
  }
  
  return `https://raw.githubusercontent.com/code4history/Chokei/main/png/${prefix}.png`;
}