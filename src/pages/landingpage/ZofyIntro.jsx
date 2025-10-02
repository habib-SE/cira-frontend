// import React from "react";

// // import orb from "../../../../assets/orb.avif"; 

// const ZofyIntro = () => {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 py-16 text-center">
//       {/* Heading */}
//       <h2 className="text-3xl md:text-5xl text-black mb-8 leading-snug font-bold">
//         Meet Zofy, First Intuitive <br />
//         AI Intelligence
//       </h2>

//       {/* Image Wrapper */}
//       <div className="relative w-full ">
//         {/* Main Image */}
//         <img
//           src="https://framerusercontent.com/images/4DChgoYQwqRAAx3JzPQRV1g.webp?scale-down-to=2048"
//           alt="Zofy AI"
//           className="w-full rounded-xl shadow-md"
//         />

//         {/* Orb Image (overlay or bottom corner) */}
//         {/* <img
//   src={orb}
//   alt="Orb"
//   className="absolute top-28 left-1/2 -translate-x-[100%] w-24 md:w-36"
// /> */}
//       </div>
//     </div>
//   );
// };

// export default ZofyIntro;


import React from "react";
import { useInView } from "react-intersection-observer";

// import orb from "../../../../assets/orb.avif";

const ZofyIntro = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.3 });

  React.useEffect(() => {
    if (inView) {
      controls.start({ scale: 1, transition: { duration: 0.6 } });
    } else {
      controls.start({ scale: 1.05 });
    }
  }, [controls, inView]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center min-h-screen bg-white px-4 py-16 text-center"
    >
      {/* Heading */}
      <h2 className="text-3xl md:text-5xl text-black mb-8 leading-snug ">
        Meet Zofy, First Intuitive <br />
        AI Intelligence
      </h2>

      {/* Image Wrapper */}
      <motion.div
        animate={controls}
        initial={{ scale: 1.05 }}
        className="relative w-full"
      >
        {/* Main Image */}
        <img
          src="https://framerusercontent.com/images/4DChgoYQwqRAAx3JzPQRV1g.webp?scale-down-to=2048"
          alt="Zofy AI"
          className="w-full rounded-xl shadow-md"
        />

        {/* Orb Image */}
        {/* <img
          src={orb}
          alt="Orb"
          className="absolute top-28 left-1/2 -translate-x-[100%] w-24 md:w-36"
        /> */}
      </motion.div>
    </div>
  );
};

export default ZofyIntro;

