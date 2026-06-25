/* Periods 1–4 of the periodic table (elements 1–36).
   mass: rounded atomic mass (g/mol)
   radius: relative atomic radius (pm) for trend visuals
   electroneg: Pauling scale, null for noble gases
   category: alkali | alkaline | transition | post | metalloid | nonmetal | halogen | noble | hydrogen
*/
window.ELEMENTS = [
  {z:1,sym:'H',name:'Hydrogen',mass:1.01,group:1,period:1,category:'hydrogen',radius:53,electroneg:2.20},
  {z:2,sym:'He',name:'Helium',mass:4.00,group:18,period:1,category:'noble',radius:31,electroneg:null},
  {z:3,sym:'Li',name:'Lithium',mass:6.94,group:1,period:2,category:'alkali',radius:167,electroneg:0.98},
  {z:4,sym:'Be',name:'Beryllium',mass:9.01,group:2,period:2,category:'alkaline',radius:112,electroneg:1.57},
  {z:5,sym:'B',name:'Boron',mass:10.81,group:13,period:2,category:'metalloid',radius:87,electroneg:2.04},
  {z:6,sym:'C',name:'Carbon',mass:12.01,group:14,period:2,category:'nonmetal',radius:67,electroneg:2.55},
  {z:7,sym:'N',name:'Nitrogen',mass:14.01,group:15,period:2,category:'nonmetal',radius:56,electroneg:3.04},
  {z:8,sym:'O',name:'Oxygen',mass:16.00,group:16,period:2,category:'nonmetal',radius:48,electroneg:3.44},
  {z:9,sym:'F',name:'Fluorine',mass:19.00,group:17,period:2,category:'halogen',radius:42,electroneg:3.98},
  {z:10,sym:'Ne',name:'Neon',mass:20.18,group:18,period:2,category:'noble',radius:38,electroneg:null},
  {z:11,sym:'Na',name:'Sodium',mass:22.99,group:1,period:3,category:'alkali',radius:190,electroneg:0.93},
  {z:12,sym:'Mg',name:'Magnesium',mass:24.31,group:2,period:3,category:'alkaline',radius:145,electroneg:1.31},
  {z:13,sym:'Al',name:'Aluminium',mass:26.98,group:13,period:3,category:'post',radius:118,electroneg:1.61},
  {z:14,sym:'Si',name:'Silicon',mass:28.09,group:14,period:3,category:'metalloid',radius:111,electroneg:1.90},
  {z:15,sym:'P',name:'Phosphorus',mass:30.97,group:15,period:3,category:'nonmetal',radius:98,electroneg:2.19},
  {z:16,sym:'S',name:'Sulfur',mass:32.07,group:16,period:3,category:'nonmetal',radius:88,electroneg:2.58},
  {z:17,sym:'Cl',name:'Chlorine',mass:35.45,group:17,period:3,category:'halogen',radius:79,electroneg:3.16},
  {z:18,sym:'Ar',name:'Argon',mass:39.95,group:18,period:3,category:'noble',radius:71,electroneg:null},
  {z:19,sym:'K',name:'Potassium',mass:39.10,group:1,period:4,category:'alkali',radius:243,electroneg:0.82},
  {z:20,sym:'Ca',name:'Calcium',mass:40.08,group:2,period:4,category:'alkaline',radius:194,electroneg:1.00},
  {z:21,sym:'Sc',name:'Scandium',mass:44.96,group:3,period:4,category:'transition',radius:184,electroneg:1.36},
  {z:22,sym:'Ti',name:'Titanium',mass:47.87,group:4,period:4,category:'transition',radius:176,electroneg:1.54},
  {z:23,sym:'V',name:'Vanadium',mass:50.94,group:5,period:4,category:'transition',radius:171,electroneg:1.63},
  {z:24,sym:'Cr',name:'Chromium',mass:52.00,group:6,period:4,category:'transition',radius:166,electroneg:1.66},
  {z:25,sym:'Mn',name:'Manganese',mass:54.94,group:7,period:4,category:'transition',radius:161,electroneg:1.55},
  {z:26,sym:'Fe',name:'Iron',mass:55.85,group:8,period:4,category:'transition',radius:156,electroneg:1.83},
  {z:27,sym:'Co',name:'Cobalt',mass:58.93,group:9,period:4,category:'transition',radius:152,electroneg:1.88},
  {z:28,sym:'Ni',name:'Nickel',mass:58.69,group:10,period:4,category:'transition',radius:149,electroneg:1.91},
  {z:29,sym:'Cu',name:'Copper',mass:63.55,group:11,period:4,category:'transition',radius:145,electroneg:1.90},
  {z:30,sym:'Zn',name:'Zinc',mass:65.38,group:12,period:4,category:'transition',radius:142,electroneg:1.65},
  {z:31,sym:'Ga',name:'Gallium',mass:69.72,group:13,period:4,category:'post',radius:136,electroneg:1.81},
  {z:32,sym:'Ge',name:'Germanium',mass:72.63,group:14,period:4,category:'metalloid',radius:125,electroneg:2.01},
  {z:33,sym:'As',name:'Arsenic',mass:74.92,group:15,period:4,category:'metalloid',radius:114,electroneg:2.18},
  {z:34,sym:'Se',name:'Selenium',mass:78.97,group:16,period:4,category:'nonmetal',radius:103,electroneg:2.55},
  {z:35,sym:'Br',name:'Bromine',mass:79.90,group:17,period:4,category:'halogen',radius:94,electroneg:2.96},
  {z:36,sym:'Kr',name:'Krypton',mass:83.80,group:18,period:4,category:'noble',radius:88,electroneg:null}
];

window.ELEMENT_CATEGORY_LABEL = {
  hydrogen:'Hydrogen', alkali:'Alkali metal', alkaline:'Alkaline earth metal',
  transition:'Transition metal', post:'Post-transition metal', metalloid:'Metalloid',
  nonmetal:'Reactive nonmetal', halogen:'Halogen', noble:'Noble gas'
};

window.ELEMENT_CATEGORY_LABEL_TH = {
  hydrogen:'ไฮโดรเจน', alkali:'โลหะแอลคาไล', alkaline:'โลหะแอลคาไลน์เอิร์ท',
  transition:'โลหะแทรนซิชัน', post:'โลหะหลังแทรนซิชัน', metalloid:'ธาตุกึ่งโลหะ',
  nonmetal:'อโลหะที่ไวต่อปฏิกิริยา', halogen:'แฮโลเจน', noble:'แก๊สมีตระกูล'
};

window.ELEMENT_NAME_TH = {
  1:'ไฮโดรเจน', 2:'ฮีเลียม', 3:'ลิเทียม', 4:'เบริลเลียม', 5:'โบรอน',
  6:'คาร์บอน', 7:'ไนโตรเจน', 8:'ออกซิเจน', 9:'ฟลูออรีน', 10:'นีออน',
  11:'โซเดียม', 12:'แมกนีเซียม', 13:'อะลูมิเนียม', 14:'ซิลิคอน', 15:'ฟอสฟอรัส',
  16:'ซัลเฟอร์', 17:'คลอรีน', 18:'อาร์กอน', 19:'โพแทสเซียม', 20:'แคลเซียม',
  21:'สแคนเดียม', 22:'ไทเทเนียม', 23:'วาเนเดียม', 24:'โครเมียม', 25:'แมงกานีส',
  26:'เหล็ก', 27:'โคบอลต์', 28:'นิกเกิล', 29:'คอปเปอร์', 30:'สังกะสี',
  31:'แกลเลียม', 32:'เจอร์เมเนียม', 33:'อาร์เซนิก', 34:'ซีลีเนียม', 35:'โบรมีน', 36:'คริปทอน'
};

window.getElementByZ = function(z){
  return window.ELEMENTS.find(function(e){ return e.z === z; });
};

window.getElementNameTh = function(z){
  return window.ELEMENT_NAME_TH[z] || '';
};

/* Standard simplified shell-filling model (2, 8, 8→18, 2→8), matching the
   pattern taught at introductory level. Real configurations for Cr (24) and
   Cu (29) differ slightly — a well-known exception covered in more advanced
   chemistry. */
window.computeShells = function(electronCount){
  var remaining = Math.max(0, electronCount);
  var shells = [0,0,0,0];

  shells[0] = Math.min(remaining,2); remaining -= shells[0];
  if(remaining<=0) return trimShells(shells);

  shells[1] = Math.min(remaining,8); remaining -= shells[1];
  if(remaining<=0) return trimShells(shells);

  shells[2] = Math.min(remaining,8); remaining -= shells[2];
  if(remaining<=0) return trimShells(shells);

  var s4a = Math.min(remaining,2); shells[3] += s4a; remaining -= s4a;
  if(remaining<=0) return trimShells(shells);

  var s3b = Math.min(remaining,18-shells[2]); shells[2] += s3b; remaining -= s3b;
  if(remaining<=0) return trimShells(shells);

  var s4b = Math.min(remaining,8-shells[3]); shells[3] += s4b; remaining -= s4b;
  return trimShells(shells);
};

function trimShells(shells){
  var out = shells.slice();
  while(out.length && out[out.length-1] === 0) out.pop();
  return out.length ? out : [0];
}
