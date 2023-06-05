// download armor.csv from DIM "organizer"
// convert csv to json using devkit
// store json in "csv" variable

// parameters //

// stat goals
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

for (let i = 0; i < legend.length; ++i) {
  let obj = {};
  obj.type = legend[i].Type // "slot"
  obj.raid = legend[i].Soure 
  if ( obj.raid !== "vaultofglass" 
    && obj.raid !== "kingsfall"
    && obj.raid !== "lastwish"
    && obj.raid !== "gardenofsalvation"
    && obj.raid !== "deepstonecrypt"
    && obj.raid !== "vowofthedisciple"
    && obj.raid !== "rootofnightmares"
  ){
    obj.raid = ""; 
  }
  obj.class = legend[i].Equippable
  switch(obj.class) {
    default:
      break;
    case "Warlock":
      // compare stats and compile defecit/supplement strings and "spike"
      break;
    case "Titan":
      break;
    case "Hunter":
      break;
  }
}
