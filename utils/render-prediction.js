// renderPrediction function jo saare predictions ko draw karta hai aur specific condition pe audio bajata hai
export const renderPrediction = (predictions, ctx, audioRef) => {
    // canvas ko pehle clear kar dete hai taaki naye frame ke liye fresh drawing ho
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
    // font set kar rahe hai label ke liye
    const font = "16px Arial";
    ctx.font = font;
    ctx.textBaseline = "top";
  
    // flags define kar rahe hai taaki pata chal sake ki person aur knife detect hua ya nahi
    let hasKnife = false;
    let hasPerson = false;
  
    // har ek prediction ke liye loop chala rahe hai
    predictions.forEach(pred => {
      // bounding box ke coordinates nikal rahe hai
      const [x, y, width, height] = pred.bbox;
  
      // alag alag objects ke liye boolean flags banaye (class ke hisaab se)
      const isPerson = pred.class === "person";
      const isKnife = pred.class === "knife";           // knife detect ho toh true
      const isBag = pred.class === "backpack";          // bag ke liye bhi agar future me kuch karna ho
      const isSpecs = pred.class === "suitcase";        // spectacles ka model me class nahi hota so use closest
  
      // agar person ya knife mila toh flags ko true kar do
      if (isPerson) hasPerson = true;
      if (isKnife) hasKnife = true;
  
      // bounding box ka color decide karo (person = red, knife = orange, others = green)
      ctx.strokeStyle = isPerson ? "#FF0000" : isKnife ? "#FFA500" : "#00FF00";
      ctx.lineWidth = 4;
  
      // bounding box draw karo
      ctx.strokeRect(x, y, width, height);
  
      // label ke peeche ek filled background draw karo
      ctx.fillStyle = ctx.strokeStyle;
      ctx.fillRect(x, y, ctx.measureText(pred.class).width + 4, parseInt(font, 10) + 4);
  
      // label text white color me likho
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(pred.class, x, y);
    });
  
    // 🔊 Audio bajane ka logic — agar person aur knife dono detect hue toh alert.mp3 play karo
    if (hasKnife && hasPerson) {
      if (audioRef?.current?.paused) {
        audioRef.current.play(); // sirf tabhi play karo jab pehle se play nahi ho raha
      }
    } else {
      // agar knife + person nahi dikha toh audio ko pause karke rewind karo
      if (audioRef?.current && !audioRef.current.paused) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  };
  








// export const renderPrediction = (predictions, ctx) => {
//     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
//     const font = "16px Arial";
//     ctx.font = font;
//     ctx.textBaseline = "top";
  
//     predictions.forEach((prediction) => {
//       const [x, y, width, height] = prediction.bbox;
//       const className = prediction.class;
  
//       // ✅ Knife detection styling
//       const isKnife = className === "knife";
//       const isBag = className === "backpack" || className === "handbag";
//       const isSpectacles = className === "spectacles"; // Just in case it's added later
//       const isPerson = className === "person";
  
//       let color = "#00FF00"; // default green
  
//       if (isKnife) color = "#FF0000";        // 🔴 red for knife
//       else if (isBag) color = "#FFA500";     // 🟠 orange for bags
//       else if (isSpectacles) color = "#0000FF"; // 🔵 blue for specs
//       else if (isPerson) color = "#FFFF00";  // 🟡 yellow for person
  
//       // Draw bounding box
//       ctx.strokeStyle = color;
//       ctx.lineWidth = 2;
//       ctx.strokeRect(x, y, width, height);
  
//       // Label background
//       ctx.fillStyle = color;
//       ctx.fillRect(x, y, ctx.measureText(className).width + 4, parseInt(font, 10) + 4);
  
//       // Label text
//       ctx.fillStyle = "#FFFFFF";
//       ctx.fillText(className, x + 2, y + 2);
//     });
  
//     // ✅ Manually draw "spectacles" for demo purpose
//     const manualSpectacles = true;
//     if (manualSpectacles) {
//       const x = 200, y = 100, width = 100, height = 30;
//       ctx.strokeStyle = "#0000FF";
//       ctx.lineWidth = 2;
//       ctx.strokeRect(x, y, width, height);
  
//       ctx.fillStyle = "#0000FF";
//       ctx.fillRect(x, y, ctx.measureText("spectacles").width + 4, 20);
  
//       ctx.fillStyle = "#FFFFFF";
//       ctx.fillText("spectacles", x + 2, y + 2);
//     }
//   };
  


