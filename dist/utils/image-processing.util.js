"use strict";
// import { createCanvas, loadImage } from "canvas";
// import { IClickableElement } from "../interfaces/app.interface";
//
// export const markElements = async (
//   base64Image: string,
//   elements: IClickableElement[],
// ): Promise<string> => {
//   const imageBuffer = Buffer.from(base64Image, "base64");
//   const image = await loadImage(imageBuffer);
//   const canvas = createCanvas(image.width, image.height);
//   const context = canvas.getContext("2d");
//
//   context.drawImage(image, 0, 0);
//
//   elements.forEach((element, index) => {
//     if (!element.isVisuallyVisible) return;
//     context.beginPath();
//     context.rect(element.coordinate.x - 5, element.coordinate.y - 5, 30, 20);
//     context.fillStyle = "green";
//     context.fill();
//
//     context.fillStyle = "#fff";
//     context.font = "12px Arial";
//     context.fillText(
//       `[${index.toString()}]`,
//       element.coordinate.x,
//       element.coordinate.y + 5,
//     );
//   });
//
//   return canvas.toDataURL();
// };
