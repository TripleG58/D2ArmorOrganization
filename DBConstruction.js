// download armor.csv from DIM "organizer"
// convert csv to json using devkit
// store json in "csv" variable

// stat goals //
// warlock
let w_res = 10;
let w_rec = 20;
let w_disc = 23;
let w_str = 23;
// titan
let t_res = 20;
let t_rec = 10;
let t_disc = 23;
let t_str = 23;
// hunter
let h_mob = 30;
let h_res = 30;
let h_rec = 30;
let h_disc = 23;

// database definition
let db = [];

// filter out exotics
let legend = structuredClone(csv);
legend = legend.filter(item => item.Tier === "Legendary");

// filter out class items
legend = legend.filter(item => item.Type !== "Warlock Bond");
legend = legend.filter(item => item.Type !== "Titan Mark");
legend = legend.filter(item => item.Type !== "Hunter Cloak");

// filter out junk / infuse / not tagged
legend = legend.filter(item => item.Tag !== "junk");
legend = legend.filter(item => item.Tag !== "infuse");
legend = legend.filter(item => item.Tag !== "");

function buildDefecitsAndSupplementsHunter(obj, itemMob, itemRes, itemRec, itemDisc, mobGoal, resGoal, recGoal, discGoal) {
  let d_diff = itemDisc - discGoal;
  let mob_diff = itemMob - mobGoal;
  let res_diff = itemRes - resGoal;
  let rec_diff = itemRec - recGoal;
  obj.spike = "mob";
  if (itemRes > itemMob) {
    obj.spike = "res";
  }
  if (itemRec > itemMob && itemRec > itemRes) {
    obj.spike = "rec";
  }
  switch(obj.spike) {
    default:
      break;
    case "mob":
      if (mob_diff > 0) {
        obj.supplements += "mob +" + mob_diff + ", ";
      }
      else if (mob_diff < 0) {
        obj.defecits += "mob " + mob_diff + ", ";
      }
      break;
    case "res":
      if (res_diff > 0) {
        obj.supplements += "res +" + res_diff + ", ";
      }
      else if (res_diff < 0) {
        obj.defecits += "res " + res_diff + ", ";
      }
      break;
    case "rec":
      if (rec_diff > 0) {
        obj.supplements += "rec +" + rec_diff + ", ";
      }
      else if (rec_diff < 0) {
        obj.defecits += "rec " + rec_diff + ", ";
      }
      break;
  }
  if (d_diff > 0) {
    obj.supplements += "disc +" + d_diff + ", ";
  }
  else if (d_diff < 0) {
    obj.defecits += "disc " + d_diff + ", ";
  }
}

function buildDefecitsAndSupplementsWarlockAndTitan(obj, itemRes, itemRec, itemDisc, itemStr, resGoal, recGoal, discGoal, strGoal) {
  // compare stats and compile defecit/supplement strings and "spike"
  obj.spike = (itemDisc >= itemStr) ? "disc" : "str";
  let d_diff = itemDisc - discGoal;
  let s_diff = itemStr - strGoal;
  let res_diff = itemRes - resGoal;
  let rec_diff = itemRec - recGoal;
  // resilience defecits/supplements
  if (res_diff > 0) {
    obj.supplements += "res +" + res_diff + ", ";
  }
  else if (res_diff < 0) {
    obj.defecits += "res " + res_diff + ", ";
  }
  // recovery defecits/supplements
  if (rec_diff > 0) {
    obj.supplements += "rec +" + rec_diff + ", ";
  }
  else if (rec_diff < 0) {
    obj.defecits += "rec " + rec_diff + ", ";
  }
  // discipline & strength defecits/supplements depending on spike
  if (obj.spike === "disc") {
    if (d_diff > 0) {
      obj.supplements += "disc +" + d_diff + ", ";
    }
    else if (d_diff < 0) {
      obj.defecits += "disc " + d_diff + ", ";
    }
  }
  else if (obj.spike === "str") {
    if (s_diff > 0) {
      obj.supplements += "str +" + s_diff + ", ";
    }
    else if (s_diff < 0) {
      obj.defecits += "str " + s_diff + ", ";
    }
  }
  // determine if supplementing for subclass fragments (10 stat)
  if (obj.class === "Warlock" && itemRes > itemRec) {
    obj.spike = "res/" + obj.spike;
  }
  else if (obj.class === "Titan" && itemRec > itemRes) {
    obj.spike = "rec/" + obj.spike;
  }
}

for (let i = 0; i < legend.length; ++i) {
  let obj = {
    "id": "",
    "class": "",
    "type": "",
    "raid": "",
    "spike": "",
    "defecits": "",
    "supplements": ""
  };
  obj.id = legend[i].Id.substr(1,legend[i].Id.length-2);
  obj.type = legend[i].Type; // "slot"
  obj.raid = legend[i].Source; 
  if ( obj.raid !== "vaultofglass" 
    && obj.raid !== "kingsfall"
    && obj.raid !== "lastwish"
    && obj.raid !== "gardenofsalvation"
    && obj.raid !== "deepstonecrypt"
    && obj.raid !== "vowofthedisciple"
    && obj.raid !== "rootofnightmares"
    && obj.raid !== "ironbanner"
  ){
    obj.raid = ""; 
    if (legend[i]["Seasonal Mod"] === "artifice") {
      obj.raid = "artifice";
    }
  }
  obj.class = legend[i].Equippable;
  switch(obj.class) {
    default:
      break;
    case "Warlock":
      buildDefecitsAndSupplementsWarlockAndTitan(
        obj,
        legend[i]["Resilience (Base)"],
        legend[i]["Recovery (Base)"],
        legend[i]["Discipline (Base)"],
        legend[i]["Strength (Base)"],
        w_res,
        w_rec,
        w_disc,
        w_str
      );
      break;
    case "Titan":
      buildDefecitsAndSupplementsWarlockAndTitan(
        obj,
        legend[i]["Resilience (Base)"],
        legend[i]["Recovery (Base)"],
        legend[i]["Discipline (Base)"],
        legend[i]["Strength (Base)"],
        t_res,
        t_rec,
        t_disc,
        t_str
      );
      break;
    case "Hunter":
      buildDefecitsAndSupplementsHunter(
        obj,
        legend[i]["Mobility (Base)"],
        legend[i]["Resilience (Base)"],
        legend[i]["Recovery (Base)"],
        legend[i]["Discipline (Base)"],
        h_mob,
        h_res,
        h_rec,
        h_disc
      );
      break;
  }
  db[db.length] = obj;
}

console.log(db);

function parseDefecitStat(stat, obj) {
  let split = obj.defecits.split(' ');
  for (let i = 0; i < split.length; ++i) {
    split[i] = split[i].split(',')[0];
  }
  let index = split.indexOf(stat);
  if (index > -1) {
    return parseInt(split[index + 1]);
  }
  else {
    return 999;
  }
}

let w = db.filter(item => item.class === "Warlock");
let wh = w.filter(item => item.type === "Helmet");
// for (i of wh) {console.log(i.id);console.log("Sup: ", i.supplements);console.log("Def: ", i.defecits)}

// let whd = wh.filter(i=>(i.defecits.includes('disc')))
let whd = wh.filter(i=>i.spike === "disc")
whd.sort((a,b)=>{ parseDefecitStat('disc', a) - parseDefecitStat('disc', b); });
for (i of whd) {console.log(i.id);console.log("Sup: ", i.supplements);console.log("Def: ", i.defecits)}

// whd[0] == best disc helmet for warlock


























