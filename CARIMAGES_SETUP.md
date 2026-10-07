# CarImages integration — automatic

There is no local setup step for the owner of this project.

When the project runs `npm run build`, `npm start`, or `npm run dev`, it automatically attempts to:

1. download the current CarImages.org rights manifest;
2. select a matching photograph for each CarCheck seed vehicle;
3. download the image into `public/carimages/`;
4. generate `src/data/carImages.generated.ts` with the required photographer/licence information.

If the deployment environment temporarily cannot reach CarImages.org, the build is allowed to continue and CarCheck shows a neutral model placeholder rather than a wrong photograph.

CarImages photographs keep their individual Creative Commons/public-domain licence. The UI shows attribution and licence links where required. Image files are not colour-graded, cropped, or otherwise transformed by the import process; the app displays them with `object-fit: contain`.
